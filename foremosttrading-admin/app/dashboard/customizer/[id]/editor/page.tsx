"use client";

import { LayerGroupManager } from "@/components/customizer/groups/LayerGroupManager";
import { useLayerGroups } from "@/components/customizer/groups/useLayerGroups";
import { SvgStructureManager } from "@/components/customizer/structure/SvgStructureManager";
import { SvgStructureObject } from "@/components/customizer/structure/types";

import { useState, useEffect, use, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Palette,
  Droplet,
  Shapes,
  Type,
  Upload,
  Type as TypeIcon,
  Trash2,
  Download,
  Loader2,
  ArrowLeft,
  SlidersHorizontal,
  Layers,
  Check,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockDb } from "@/services/mockDb";
import { ProductCanvas, ProductCanvasRef } from "@/components/customizer/ProductCanvas";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const resolveUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const SUPPORTED_TAGS = ["path", "rect", "circle", "ellipse", "polygon", "polyline", "line", "text", "image", "use", "g"];

// Module-level in-memory SVG cache for admin editor
const adminSvgCache = new Map<string, string>();
const adminPendingFetches = new Map<string, Promise<string>>();

function DynamicSvgRenderer({
  svgUrl,
  svgRaw,
  colors,
  selectedLayerIds = [],
  partsMap = {},
  hiddenLayerIds = [],
  lockedLayerIds = [],
  onLayerSelect,
  onLayersDetected,
}: {
  svgUrl?: string;
  svgRaw?: string;
  colors: Record<string, string>;
  selectedLayerIds?: string[];
  partsMap?: Record<string, string>;
  hiddenLayerIds?: string[];
  lockedLayerIds?: string[];
  onLayerSelect?: (elementId: string, isMultiSelect: boolean, isRangeSelect: boolean) => void;
  onLayersDetected?: (layers: Array<{ id: string; label: string; defaultColor: string; layerType: string }>) => void;
}) {
  const [svgContent, setSvgContent] = useState<string | null>(() => {
    if (svgRaw) return svgRaw;
    if (svgUrl && adminSvgCache.has(svgUrl)) return adminSvgCache.get(svgUrl)!;
    return null;
  });
  const [loading, setLoading] = useState(!svgRaw && Boolean(svgUrl) && !adminSvgCache.has(svgUrl || ""));
  const [error, setError] = useState<string | null>(null);
  const [hoveredBadge, setHoveredBadge] = useState<{ label: string; type?: string; x: number; y: number } | null>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const elementCacheRef = useRef<Map<string, SVGElement>>(new Map());

  useEffect(() => {
    if (svgRaw) {
      setSvgContent(svgRaw);
      setLoading(false);
      return;
    }
    if (!svgUrl) return;

    if (adminSvgCache.has(svgUrl)) {
      setSvgContent(adminSvgCache.get(svgUrl)!);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token") || localStorage.getItem("token")
        : null;

    let fetchPromise = adminPendingFetches.get(svgUrl);
    if (!fetchPromise) {
      fetchPromise = fetch(svgUrl, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("SVG load failed (" + res.status + ")");
          return res.text();
        })
        .then((text) => {
          adminSvgCache.set(svgUrl, text);
          adminPendingFetches.delete(svgUrl);
          return text;
        })
        .catch((err) => {
          adminPendingFetches.delete(svgUrl);
          throw err;
        });
      adminPendingFetches.set(svgUrl, fetchPromise);
    }

    fetchPromise
      .then((text) => {
        if (isMounted) {
          setSvgContent(text);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("SVG fetch error:", err);
        if (isMounted) {
          setError("Failed to load SVG template: " + (err.message || "403 Forbidden"));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [svgUrl, svgRaw]);



  // Extract and auto-detect all meaningful vector shape layers from SVG DOM
  const extractLayersFromSvgDom = useCallback((svg: SVGSVGElement) => {
    const isUtilityNode = (el: Element) => {
      return Boolean(el.closest("defs, clipPath, mask, pattern, symbol"));
    };

    const viewBox = svg.viewBox?.baseVal;
    const svgW = viewBox?.width || svg.clientWidth || 1000;
    const svgH = viewBox?.height || svg.clientHeight || 1000;

    const isFullBleedBackground = (el: Element) => {
      const tag = el.tagName.toLowerCase();
      if (tag === "rect" || tag === "path") {
        const wAttr = el.getAttribute("width");
        const hAttr = el.getAttribute("height");
        if (wAttr === "100%" || hAttr === "100%") return true;
        if (wAttr && parseFloat(wAttr) >= svgW * 0.98 && hAttr && parseFloat(hAttr) >= svgH * 0.98) return true;
      }
      return false;
    };

    const formatLabel = (raw: string) => {
      return raw
        .replace(/[-_]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
    };

    const results: Array<{ id: string; label: string; defaultColor: string; layerType: string }> = [];
    const processedIds = new Set<string>();

    // 1. First, harvest all named groups and named vector elements
    const namedElements = Array.from(svg.querySelectorAll("[id], [data-name], [inkscape\\:label]")).filter((el) => {
      if (el.id === "svg-selection-overlay" || el.closest("#svg-selection-overlay")) return false;
      if (isUtilityNode(el)) return false;
      if (isFullBleedBackground(el)) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === "svg" || tag === "style" || tag === "script" || tag === "metadata") return false;
      if (tag === "g" && el.children.length === 0) return false;
      return true;
    });

    namedElements.forEach((node) => {
      const id = node.getAttribute("id") || node.getAttribute("data-name");
      if (!id || processedIds.has(id)) return;

      const lowerId = id.toLowerCase();
      if (lowerId === "svg" || lowerId === "root" || lowerId === "canvas" || lowerId === "viewport" || lowerId === "g") return;

      processedIds.add(id);

      const tagName = node.tagName.toLowerCase();
      let layerType = "FILL";
      if (tagName === "text") layerType = "TEXT";
      else if (tagName === "image") layerType = "IMAGE";
      else if (tagName === "g") layerType = "GROUP";
      else {
        const stroke = node.getAttribute("stroke") || (node as HTMLElement).style.stroke;
        const fill = node.getAttribute("fill") || (node as HTMLElement).style.fill;
        if (stroke && stroke !== "none" && fill === "none") layerType = "STROKE";
      }

      const rawLabel = node.getAttribute("data-name") || node.getAttribute("inkscape:label") || id;
      const label = formatLabel(rawLabel);
      const fillAttr = node.getAttribute("fill") || (node as HTMLElement).style.fill || "#FFFFFF";

      results.push({
        id,
        label: label || id,
        defaultColor: fillAttr.startsWith("url") ? "#FFFFFF" : fillAttr,
        layerType,
      });
    });

    // 2. Next, for any standalone shape that is NOT inside an already-processed named group
    const standaloneShapes = Array.from(
      svg.querySelectorAll("path, rect, circle, ellipse, polygon, polyline, line, text, tspan, textPath, image")
    ).filter((el) => {
      if (el.id === "svg-selection-overlay" || el.closest("#svg-selection-overlay")) return false;
      if (isUtilityNode(el)) return false;
      if (isFullBleedBackground(el)) return false;
      const existingId = el.getAttribute("id");
      if (existingId && processedIds.has(existingId)) return false;

      // Skip if nested inside an already-processed parent group
      let parent = el.parentElement;
      while (parent && parent !== svg) {
        const parentId = parent.getAttribute("id") || parent.getAttribute("data-name");
        if (parentId && processedIds.has(parentId)) {
          return false;
        }
        parent = parent.parentElement;
      }
      return true;
    });

    let shapeCounter = 1;
    standaloneShapes.forEach((node) => {
      let id = node.getAttribute("id");
      const tagName = node.tagName.toLowerCase();

      if (!id) {
        id = `${tagName}_${shapeCounter++}`;
        node.setAttribute("id", id);
      }

      if (processedIds.has(id)) return;
      processedIds.add(id);

      let layerType = "FILL";
      if (tagName === "text" || tagName === "tspan" || tagName === "textpath") layerType = "TEXT";
      else if (tagName === "image") layerType = "IMAGE";
      else {
        const stroke = node.getAttribute("stroke") || (node as HTMLElement).style.stroke;
        const fill = node.getAttribute("fill") || (node as HTMLElement).style.fill;
        if (stroke && stroke !== "none" && fill === "none") layerType = "STROKE";
      }

      const rawLabel = node.getAttribute("data-name") || node.getAttribute("inkscape:label") || id;
      const label = formatLabel(rawLabel);

      results.push({
        id,
        label: label || id,
        defaultColor: "#FFFFFF",
        layerType,
      });
    });

    const getEffectiveColor = (el: Element): string => {
      const fillAttr = el.getAttribute("fill");
      if (fillAttr && fillAttr !== "none" && !fillAttr.startsWith("url(")) return fillAttr;

      const strokeAttr = el.getAttribute("stroke");
      if (strokeAttr && strokeAttr !== "none" && !strokeAttr.startsWith("url(")) return strokeAttr;

      if (el instanceof HTMLElement || el instanceof SVGElement) {
        if (el.style.fill && el.style.fill !== "none" && !el.style.fill.startsWith("url(")) return el.style.fill;
        if (el.style.stroke && el.style.stroke !== "none" && !el.style.stroke.startsWith("url(")) return el.style.stroke;

        if (typeof window !== "undefined") {
          try {
            const comp = window.getComputedStyle(el);
            if (comp.fill && comp.fill !== "none" && comp.fill !== "rgba(0, 0, 0, 0)" && !comp.fill.startsWith("url(")) {
              return comp.fill;
            }
            if (comp.stroke && comp.stroke !== "none" && comp.stroke !== "rgba(0, 0, 0, 0)" && !comp.stroke.startsWith("url(")) {
              return comp.stroke;
            }
          } catch (e) { }
        }
      }

      // Check first child if group
      if (el.children && el.children.length > 0) {
        for (let i = 0; i < el.children.length; i++) {
          const childColor = getEffectiveColor(el.children[i]);
          if (childColor && childColor !== "#1F1F1F") return childColor;
        }
      }

      return "#1F1F1F";
    };

    results.forEach((item, index) => {
      const el = findSvgElement(svg, item.id);
      if (el) {
        item.defaultColor = getEffectiveColor(el);
      }
    });

    return results;
  }, []);

  // Set of detected layer IDs for quick lookup during canvas clicks
  const detectedLayerIdsRef = useRef<Set<string>>(new Set());

  // 1. Ingest SVG Content into DOM ONCE when template changes & Auto-detect layers
  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;
    svgContainerRef.current.innerHTML = svgContent;

    const svgEl = svgContainerRef.current.querySelector("svg");
    if (svgEl) {
      const detected = extractLayersFromSvgDom(svgEl);
      detectedLayerIdsRef.current = new Set(detected.map((d) => d.id));

      if (onLayersDetected && detected.length > 0) {
        onLayersDetected(detected);
      }
      try {
        applyPatches();
      } catch (e) {
        console.error("[DynamicSvgRenderer] applyPatches error:", e);
      }
    }
  }, [svgContent, extractLayersFromSvgDom, onLayersDetected]);

  const findSvgElement = (svg: SVGSVGElement, id: string): SVGElement | null => {
    if (!id) return null;
    try {
      const exact = svg.querySelector("#" + CSS.escape(id)) as SVGElement | null;
      if (exact) return exact;
    } catch (e) { }

    const lowerId = id.toLowerCase();
    const cleanId = lowerId.replace(/[-_]/g, "");
    const all = svg.querySelectorAll("[id]");
    for (let i = 0; i < all.length; i++) {
      const item = all[i] as SVGElement;
      if (item.id && item.id !== "svg-selection-overlay") {
        const itemLower = item.id.toLowerCase();
        if (itemLower === lowerId || itemLower.replace(/[-_]/g, "") === cleanId) {
          return item;
        }
      }
    }

    // Index-based fallback ONLY on artwork vector shapes
    const numMatch = id.match(/\d+/);
    if (numMatch) {
      const layerIdx = parseInt(numMatch[0], 10) - 1;
      if (layerIdx >= 0) {
        const viewBox = svg.viewBox?.baseVal;
        const svgW = viewBox?.width || svg.clientWidth || 1000;
        const svgH = viewBox?.height || svg.clientHeight || 1000;

        const leafShapes = Array.from(
          svg.querySelectorAll("path, rect, circle, ellipse, polygon, polyline, line")
        ).filter((el) => {
          if (el.id === "svg-selection-overlay" || el.closest("#svg-selection-overlay")) return false;
          if (el.closest("defs, clipPath, mask, pattern, symbol")) return false;
          const wAttr = el.getAttribute("width");
          const hAttr = el.getAttribute("height");
          if (wAttr === "100%" || hAttr === "100%") return false;
          if (wAttr && parseFloat(wAttr) >= svgW * 0.95 && hAttr && parseFloat(hAttr) >= svgH * 0.95) return false;

          return true;
        });

        if (leafShapes[layerIdx]) {
          return leafShapes[layerIdx] as SVGElement;
        }
      }
    }

    return null;
  };

  const applyPatches = useCallback(() => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector("svg");
    if (!svgEl) return;

    // Create or reset top-level SVG selection overlay group
    let overlay = svgEl.querySelector("#svg-selection-overlay");
    if (overlay) {
      overlay.remove();
    }
    overlay = document.createElementNS("http://www.w3.org/2000/svg", "g");
    overlay.setAttribute("id", "svg-selection-overlay");
    (overlay as HTMLElement).style.pointerEvents = "none";
    svgEl.appendChild(overlay);

    const applyColorToNode = (node: SVGElement, color: string) => {
      node.style.cursor = "pointer";

      const fillAttr = node.getAttribute("fill") || node.style.fill;
      const strokeAttr = node.getAttribute("stroke") || node.style.stroke;

      // Do not overwrite url() fill gradients
      if (fillAttr && fillAttr.startsWith("url(")) return;

      if (fillAttr && fillAttr !== "none") {
        node.style.setProperty("fill", color, "important");
        node.setAttribute("fill", color);
      } else if (strokeAttr && strokeAttr !== "none") {
        node.style.setProperty("stroke", color, "important");
        node.setAttribute("stroke", color);
      }

      if (node.children && node.children.length > 0) {
        Array.from(node.children).forEach((child) => {
          if (child instanceof SVGElement && child.id !== "svg-selection-overlay") {
            applyColorToNode(child, color);
          }
        });
      }
    };

    Object.entries(colors).forEach(([elementId, color]) => {
      if (!color) return;
      const el = findSvgElement(svgEl, elementId);
      if (!el) return;

      // Skip applying if color is white default and element already has a valid dark/colored fill
      const currentFill = el.getAttribute("fill") || el.style.fill;
      if (
        (color === "#FFFFFF" || color === "#ffffff") &&
        currentFill &&
        currentFill !== "#FFFFFF" &&
        currentFill !== "#ffffff" &&
        currentFill !== "none"
      ) {
        return;
      }

      applyColorToNode(el, color);
    });

    // Handle hidden layers
    if (hiddenLayerIds && hiddenLayerIds.length > 0) {
      hiddenLayerIds.forEach((id) => {
        const hiddenEl = findSvgElement(svgEl, id);
        if (hiddenEl) {
          (hiddenEl as HTMLElement).style.display = "none";
        }
      });
    }

    if (selectedLayerIds && selectedLayerIds.length > 0) {
      selectedLayerIds.forEach((id) => {
        const selectedEl = findSvgElement(svgEl, id);
        if (!selectedEl) return;

        // Non-destructive filter glow indicator
        selectedEl.style.filter = "drop-shadow(0 0 6px rgba(37, 99, 235, 0.9)) brightness(1.1)";
        selectedEl.style.transition = "filter 0.15s ease-in-out";

        // Non-destructive Figma bounding box overlay
        if ("getBBox" in selectedEl) {
          try {
            const bbox = (selectedEl as SVGGraphicsElement).getBBox();
            if (bbox && bbox.width > 0 && bbox.height > 0) {
              const pad = Math.max(3, Math.min(bbox.width, bbox.height) * 0.04);
              const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
              rect.setAttribute("x", String(bbox.x - pad));
              rect.setAttribute("y", String(bbox.y - pad));
              rect.setAttribute("width", String(bbox.width + pad * 2));
              rect.setAttribute("height", String(bbox.height + pad * 2));
              rect.setAttribute("rx", "4");
              rect.setAttribute("ry", "4");
              rect.setAttribute("fill", "rgba(59, 130, 246, 0.15)");
              rect.setAttribute("stroke", "#2563eb");
              rect.setAttribute("stroke-width", "2");
              rect.setAttribute("stroke-dasharray", "4,3");
              (rect as HTMLElement).style.pointerEvents = "none";
              overlay?.appendChild(rect);
            }
          } catch (err) { }
        }
      });
    }

    svgEl.setAttribute("width", "100%");
    svgEl.setAttribute("height", "100%");
    svgEl.style.width = "100%";
    svgEl.style.height = "100%";
    svgEl.style.maxWidth = "100%";
    svgEl.style.maxHeight = "100%";
  }, [colors, selectedLayerIds, hiddenLayerIds]);

  // 2. Patch colors and selection overlays when selection or colors change
  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;
    try {
      applyPatches();
    } catch (e) {
      console.error("[DynamicSvgRenderer] applyPatches error:", e);
    }
  }, [colors, selectedLayerIds, hiddenLayerIds, applyPatches, svgContent]);

  // 3. Figma-style interactive SVG layer selection & click detection
  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector("svg");
    if (!svgEl) return;

    const handleClick = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;
      while (target && target !== svgEl) {
        if (target.id === "svg-selection-overlay" || target.closest("#svg-selection-overlay")) {
          return;
        }
        if (target.closest("defs, clipPath, mask, pattern, symbol")) {
          return;
        }

        const id = target.getAttribute("id");
        // Ascend tree to find the nearest recognized layer ID
        if (id && (detectedLayerIdsRef.current.has(id) || colors.hasOwnProperty(id))) {
          if (lockedLayerIds && lockedLayerIds.includes(id)) {
            target = target.parentElement;
            continue;
          }

          try {
            (target as HTMLElement).animate(
              [
                { opacity: 0.6, transform: "scale(0.98)" },
                { opacity: 1, transform: "scale(1)" }
              ],
              { duration: 180, easing: "ease-out" }
            );
          } catch (err) { }

          if (onLayerSelect) {
            onLayerSelect(id, e.ctrlKey || e.metaKey, e.shiftKey);
          }
          break;
        }

        target = target.parentElement;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;
      while (target && target !== svgEl) {
        if (target.id === "svg-selection-overlay" || target.closest("#svg-selection-overlay")) {
          return;
        }
        if (target.closest("defs, clipPath, mask, pattern, symbol")) {
          return;
        }

        const id = target.getAttribute("id");
        if (id && (detectedLayerIdsRef.current.has(id) || colors.hasOwnProperty(id))) {
          const displayLabel = partsMap[id] || id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

          if (!selectedLayerIds.includes(id)) {
            (target as HTMLElement).style.filter = "drop-shadow(0 0 6px rgba(59, 130, 246, 0.8)) brightness(1.08)";
            (target as HTMLElement).style.transition = "filter 0.15s ease-in-out";
          }

          if (svgContainerRef.current) {
            const rect = svgContainerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const tagName = target.tagName.toUpperCase();
            setHoveredBadge({ label: displayLabel, type: tagName, x, y });
          }
          return;
        }
        target = target.parentElement;
      }
      setHoveredBadge(null);
    };

    const handleMouseOut = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;
      while (target && target !== svgEl) {
        const id = target.getAttribute("id");
        if (id) {
          if (!selectedLayerIds.includes(id)) {
            (target as HTMLElement).style.filter = "";
          }
          break;
        }
        target = target.parentElement;
      }
      setHoveredBadge(null);
    };

    svgEl.addEventListener("click", handleClick);
    svgEl.addEventListener("mousemove", handleMouseMove);
    svgEl.addEventListener("mouseout", handleMouseOut);

    return () => {
      svgEl.removeEventListener("click", handleClick);
      svgEl.removeEventListener("mousemove", handleMouseMove);
      svgEl.removeEventListener("mouseout", handleMouseOut);
    };
  }, [svgContent, colors, selectedLayerIds, lockedLayerIds, partsMap, onLayerSelect]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs font-medium">Loading SVG preview…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-amber-600 text-xs font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div
        ref={svgContainerRef}
        className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-full [&>svg]:h-full"
      />
      {hoveredBadge && (
        <div
          className="absolute z-30 pointer-events-none bg-gray-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xl backdrop-blur-xs transition-transform transform -translate-x-1/2 -translate-y-full border border-white/20 whitespace-nowrap flex items-center gap-1.5"
          style={{ left: hoveredBadge.x, top: hoveredBadge.y - 8 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Layer: {hoveredBadge.label} {hoveredBadge.type ? `(${hoveredBadge.type})` : ""}
        </div>
      )}
    </div>
  );
}

const tabs = [
  { id: "views", label: "Views", icon: Palette },
  { id: "colors", label: "Colors", icon: Droplet },
  { id: "elements", label: "Elements", icon: Shapes },
  { id: "text", label: "Text", icon: Type },
];

const PRESET_COLORS = [
  "#FFFFFF", "#000000", "#FF3B30", "#FF9500", "#FFCC00",
  "#4CD964", "#5AC8FA", "#007AFF", "#5856D6", "#FF2D55",
  "#555555", "#8E8E93"
];

interface ProductView {
  id: string;
  name: string;
  svgUrl?: string;
  svgRaw?: string;
  viewOrder?: number;
  layers?: Array<{
    id: string;
    elementId: string;
    layerName: string;
    defaultColor?: string;
  }>;
}

interface ProductSchema {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  images: string[];
  isCustomizable: boolean;
  isActive: boolean;
  svgUrl?: string | null;
  svgRaw?: string | null;
  views: ProductView[];
  customizableParts: Array<{
    id: string;
    label: string;
    defaultColor: string;
    isEditable?: boolean;
    isRequired?: boolean;
    isLocked?: boolean;
  }>;
  defaultColors: Record<string, string>;
}

export default function CustomizerEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductSchema | null>(null);

  const [activeTab, setActiveTab] = useState("colors");
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [layerColors, setLayerColors] = useState<Record<string, string>>({});
  const [previewColors, setPreviewColors] = useState<Record<string, string> | null>(null);
  const [textInput, setTextInput] = useState("YOUR TEXT");
  const [textColor, setTextColor] = useState("#000000");
  const [textFontFamily, setTextFontFamily] = useState("Oswald");
  const [textFontWeight, setTextFontWeight] = useState("bold");
  const [textFontSize, setTextFontSize] = useState(36);

  const [hiddenLayerIds, setHiddenLayerIds] = useState<string[]>([]);
  const [lockedLayerIds, setLockedLayerIds] = useState<string[]>([]);

  const toggleLayerVisibility = (layerId: string) => {
    setHiddenLayerIds((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  };

  const toggleLayerLock = (layerId: string) => {
    setLockedLayerIds((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  };

  const {
    groups,
    setGroups,
    selectedLayerIds,
    setSelectedLayerIds,
    createGroup,
    renameGroup,
    toggleGroupLock,
    toggleGroupVisibility,
    deleteGroup,
    duplicateGroup,
    assignLayersToGroup,
    renameLayerLabel,
    removeLayerFromGroup,
    selectGroup,
  } = useLayerGroups();

  const canvasRef = useRef<ProductCanvasRef>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const layerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [uploadingSvg, setUploadingSvg] = useState(false);

  const handleSvgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !productId) return;
    e.target.value = "";

    setUploadingSvg(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || localStorage.getItem("token") : null;
      const body = new FormData();
      body.append("file", file);

      const res = await fetch(`${API_BASE_URL}/upload/uploads/svg`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.data?.message || err?.message || "SVG upload failed");
      }

      const json = await res.json();
      const payload = json?.data ?? json;

      if (!payload?.uploadId) throw new Error("No uploadId returned from backend.");

      await mockDb.updateProductAsync(productId, {
        uploadId: payload.uploadId,
      } as any);

      // Re-fetch config schema
      const schemaRes = await mockDb.fetchApi(`/products/${productId}/config-schema`);
      const schemaData = schemaRes?.data !== undefined ? schemaRes.data : schemaRes;

      if (schemaData) {
        setProduct((prev) => prev ? {
          ...prev,
          svgUrl: schemaData.svgUrl || payload.svgUrl,
          svgRaw: schemaData.svgRaw || payload.svgRaw,
          views: schemaData.views || [],
          customizableParts: schemaData.customizableParts || prev.customizableParts,
        } : prev);
      }
    } catch (err: any) {
      console.error("SVG upload error:", err);
      alert(err.message || "Failed to upload SVG template");
    } finally {
      setUploadingSvg(false);
    }
  };

  const viewFileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadViewName, setActiveUploadViewName] = useState<string>("FRONT");

  const handleSpecificViewUpload = async (file: File, viewName: string) => {
    if (!file || !productId) return;

    setUploadingSvg(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || localStorage.getItem("token") : null;
      const body = new FormData();
      body.append("file", file);

      const res = await fetch(`${API_BASE_URL}/upload/uploads/svg`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.data?.message || err?.message || "SVG upload failed");
      }

      const json = await res.json();
      const payload = json?.data ?? json;

      if (!payload?.uploadId) throw new Error("No uploadId returned from backend.");

      await mockDb.updateProductAsync(productId, {
        views: [{ name: viewName, uploadId: payload.uploadId }],
      } as any);

      // Re-fetch config schema
      const schemaRes = await mockDb.fetchApi(`/products/${productId}/config-schema`);
      const schemaData = schemaRes?.data !== undefined ? schemaRes.data : schemaRes;

      if (schemaData) {
        setProduct((prev) => prev ? {
          ...prev,
          svgUrl: schemaData.svgUrl || payload.svgUrl,
          svgRaw: schemaData.svgRaw || payload.svgRaw,
          views: schemaData.views || [],
          customizableParts: schemaData.customizableParts || prev.customizableParts,
        } : prev);
      }
    } catch (err: any) {
      console.error("SVG view upload error:", err);
      alert(err.message || "Failed to upload SVG view");
    } finally {
      setUploadingSvg(false);
    }
  };

  const handleLayersDetected = useCallback(
    (detectedLayers: Array<{ id: string; label: string; defaultColor: string; layerType: string }>) => {
      setProduct((prev) => {
        if (!prev) return prev;
        const existingIds = new Set((prev.customizableParts || []).map((p) => p.id));
        const newParts = detectedLayers
          .filter((l) => !existingIds.has(l.id))
          .map((l) => ({
            id: l.id,
            label: l.label,
            defaultColor: l.defaultColor,
            isEditable: true,
            layerType: l.layerType,
          }));

        if (newParts.length === 0) return prev;

        return {
          ...prev,
          customizableParts: [...prev.customizableParts, ...newParts],
        };
      });

      setLayerColors((prev) => {
        const next = { ...prev };
        let changed = false;
        detectedLayers.forEach((l) => {
          if (!next[l.id]) {
            next[l.id] = l.defaultColor || "#FFFFFF";
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    },
    []
  );

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);

    mockDb.fetchApi(`/products/${productId}/config-schema`)
      .then((res) => {
        const data = res?.data !== undefined ? res.data : res;
        const parsedProduct: ProductSchema = {
          id: data.id || productId,
          slug: data.slug || productId,
          name: data.name || "Custom Product",
          description: data.description || "",
          category: data.category || "Apparel",
          basePrice: Number(data.basePrice) || 0,
          images: data.images || [],
          isCustomizable: Boolean(data.isCustomizable),
          isActive: Boolean(data.isActive),
          svgUrl: data.svgUrl || null,
          svgRaw: data.svgRaw || null,
          views: data.views || [],
          customizableParts: data.customizableParts || [],
          defaultColors: data.defaultColors || {},
        };

        setProduct(parsedProduct);

        if (parsedProduct.defaultColors && Object.keys(parsedProduct.defaultColors).length > 0) {
          setLayerColors(parsedProduct.defaultColors);
        } else if (parsedProduct.customizableParts) {
          const initial: Record<string, string> = {};
          parsedProduct.customizableParts.forEach((p: any) => {
            initial[p.id] = p.defaultColor || "#FFFFFF";
          });
          setLayerColors(initial);
        }

        if (parsedProduct.customizableParts && parsedProduct.customizableParts.length > 0) {
          setSelectedLayerIds([parsedProduct.customizableParts[0].id]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to fetch product config schema, trying product endpoint:", err);
        mockDb.fetchApi(`/products/${productId}`)
          .then((res) => {
            const prod = res?.data !== undefined ? res.data : res;
            setProduct({
              id: prod.id || productId,
              slug: prod.slug || productId,
              name: prod.name || "Custom Product",
              description: prod.description || "",
              category: prod.category?.name || "Apparel",
              basePrice: Number(prod.basePrice) || 0,
              images: prod.images?.map((i: any) => i.imageUrl) || [],
              isCustomizable: Boolean(prod.isCustomizable),
              isActive: Boolean(prod.isActive),
              views: [],
              customizableParts: [],
              defaultColors: {},
            });
            setLoading(false);
          })
          .catch((e) => {
            console.error("Failed to fetch product:", e);
            setError("Failed to load product from backend");
            setLoading(false);
          });
      });
  }, [productId]);

  const partsMap = useMemo(() => {
    const map: Record<string, string> = {};
    product?.customizableParts?.forEach((p) => {
      map[p.id] = p.label || p.id;
    });
    return map;
  }, [product]);

  const handleLayerSelect = (layerId: string, isMultiSelect = false, isRangeSelect = false) => {
    setActiveTab("colors");

    // Auto-register newly detected SVG layer into customizableParts if missing
    setProduct((prevProduct) => {
      if (!prevProduct) return prevProduct;
      const exists = prevProduct.customizableParts.some((p) => p.id === layerId);
      if (!exists) {
        const newPart = {
          id: layerId,
          label: layerId.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          defaultColor: "#FFFFFF",
          isEditable: true,
        };
        return {
          ...prevProduct,
          customizableParts: [...prevProduct.customizableParts, newPart],
        };
      }
      return prevProduct;
    });

    setLayerColors((prev) => {
      if (!prev[layerId]) {
        return { ...prev, [layerId]: "#FFFFFF" };
      }
      return prev;
    });

    if (isRangeSelect && selectedLayerIds.length > 0 && product?.customizableParts) {
      const allIds = product.customizableParts.map((p) => p.id);
      const lastId = selectedLayerIds[selectedLayerIds.length - 1];
      const idx1 = allIds.indexOf(lastId);
      const idx2 = allIds.indexOf(layerId);
      if (idx1 !== -1 && idx2 !== -1) {
        const start = Math.min(idx1, idx2);
        const end = Math.max(idx1, idx2);
        const range = allIds.slice(start, end + 1);
        setSelectedLayerIds(Array.from(new Set([...selectedLayerIds, ...range])));
      } else {
        setSelectedLayerIds([layerId]);
      }
    } else if (isMultiSelect) {
      if (selectedLayerIds.includes(layerId)) {
        if (selectedLayerIds.length > 1) {
          setSelectedLayerIds(selectedLayerIds.filter((id) => id !== layerId));
        }
      } else {
        setSelectedLayerIds([...selectedLayerIds, layerId]);
      }
    } else {
      setSelectedLayerIds([layerId]);
    }

    setTimeout(() => {
      if (layerRefs.current[layerId]) {
        layerRefs.current[layerId]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 50);
  };

  const handleSelectAllLayers = () => {
    if (product?.customizableParts) {
      setSelectedLayerIds(product.customizableParts.map((p) => p.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedLayerIds([]);
  };

  const handleSwatchHover = (color: string) => {
    if (selectedLayerIds.length === 0) return;
    setPreviewColors((prev) => {
      const next = { ...(prev || layerColors) };
      selectedLayerIds.forEach((id) => {
        next[id] = color;
      });
      return next;
    });
  };

  const handleSwatchLeave = () => {
    setPreviewColors(null);
  };

  const handleBatchColorChange = (color: string) => {
    if (selectedLayerIds.length === 0) return;
    setPreviewColors(null);
    setLayerColors((prev) => {
      const next = { ...prev };
      selectedLayerIds.forEach((id) => {
        next[id] = color;
      });
      return next;
    });
  };

  const handleAddText = () => {
    if (canvasRef.current) {
      canvasRef.current.addText(textInput, {
        fill: textColor,
        fontFamily: textFontFamily,
        fontWeight: textFontWeight,
        fontSize: textFontSize,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvasRef.current) {
      const url = URL.createObjectURL(file);
      canvasRef.current.addImage(url);
    }
    e.target.value = "";
  };

  const handleDelete = () => {
    if (canvasRef.current) {
      canvasRef.current.deleteSelected();
    }
  };

  const handleSaveDesign = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.saveCanvas();
      const link = document.createElement("a");
      link.href = dataUrl;
      const currentView = product?.views[activeViewIndex]?.name || "custom";
      link.download = `${product?.slug || "design"}-${currentView.toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f5f7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-muted-foreground">Loading product record from backend…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#f4f5f7]">
        <h2 className="text-xl font-bold text-destructive">Product Load Error</h2>
        <p className="text-sm text-muted-foreground">{error || "Product record not found."}</p>
        <Link href="/dashboard/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Product Listing
          </Button>
        </Link>
      </div>
    );
  }

  const currentView = product.views && product.views.length > 0 ? product.views[activeViewIndex] : null;
  const rawSvgPath = currentView?.svgUrl || product.svgUrl || "";
  const activeSvgUrl = resolveUrl(rawSvgPath);
  const activeSvgRaw = currentView?.svgRaw || product.svgRaw || undefined;

  const activeColorMap = previewColors || layerColors;
  const activeLayerColor = selectedLayerIds.length > 0 ? (activeColorMap[selectedLayerIds[0]] || "#FFFFFF") : "#FFFFFF";

  return (
    <div className="flex h-screen bg-[#f4f5f7] overflow-hidden -m-8">
      {/* Header Info */}
      <div className="absolute top-4 left-8 z-10 flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="outline" size="sm" className="h-9 px-2.5 bg-white border-gray-200 hover:bg-gray-50 shadow-sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Products
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-gray-900">{product.name}</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {product.category}
            </span>
          </div>
          <p className="font-bold text-base text-[#f48a27]">
            ${(Number(product.basePrice) || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 w-full h-full p-8 pt-24 gap-6">

        {/* Left Pane: Preview Area */}
        <div className="flex-1 bg-slate-100 rounded-xl shadow-inner border border-gray-200 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-200/60 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6 border border-slate-300/50">

              {/* Overlay Action Tools */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <Button variant="outline" size="icon" onClick={handleDelete} className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600 shadow-sm border-gray-200" title="Delete Selected Item">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* SVG Vector Preview & Dynamic Color Patching */}
              {(activeSvgUrl || activeSvgRaw) ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <DynamicSvgRenderer
                    key={currentView?.id || activeViewIndex}
                    svgUrl={activeSvgUrl}
                    svgRaw={activeSvgRaw}
                    colors={activeColorMap}
                    selectedLayerIds={selectedLayerIds}
                    partsMap={partsMap}
                    hiddenLayerIds={hiddenLayerIds}
                    lockedLayerIds={lockedLayerIds}
                    onLayerSelect={handleLayerSelect}
                    onLayersDetected={handleLayersDetected}
                  />
                  <div className="absolute inset-0 pointer-events-none [&_canvas]:pointer-events-auto">
                    <ProductCanvas
                      ref={canvasRef}
                      shapeName={currentView?.name || "Product View"}
                      tintColor="transparent"
                      customShapeUrl=""
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-gray-200 shadow-sm max-w-md">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".svg"
                    className="hidden"
                    onChange={handleSvgUpload}
                  />
                  <Layers className="h-10 w-10 text-blue-500 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900">No SVG Vector Template Uploaded</h3>
                    <p className="text-xs text-gray-500">
                      Product <strong>{product.name}</strong> has no SVG template file linked yet. Upload an SVG template to configure vector customization layers.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="text-xs h-8 cursor-pointer"
                    disabled={uploadingSvg}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingSvg ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Uploading &amp; Parsing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload SVG Template
                      </>
                    )}
                  </Button>
                </div>
              )}

            </div>
          </div>
        </div>


        {/* Right Pane: Controls */}
        <div className="w-[420px] flex flex-col gap-4">
          <Card className="flex-1 border-gray-100 shadow-sm flex flex-col overflow-hidden bg-white">
            <CardContent className="p-4 flex flex-col h-full gap-4">

              {/* Tabs Header */}
              <div className="grid grid-cols-4 gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex flex-col items-center justify-center py-3 rounded-lg border transition-all text-xs font-medium gap-1.5",
                        isActive
                          ? "bg-blue-600 border-blue-600 text-white shadow-md"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      )}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

                {/* VIEWS TAB */}
                {activeTab === "views" && (
                  <div className="flex flex-col gap-4 pb-4">
                    <input
                      type="file"
                      ref={viewFileInputRef}
                      accept=".svg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleSpecificViewUpload(file, activeUploadViewName);
                        }
                        e.target.value = "";
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">Product 360° Views</h3>
                        <p className="text-xs text-gray-500">4-View Vector Canvas System for <strong>{product.name}</strong></p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {product.views?.length || 0} / 4 Views Loaded
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {["FRONT", "BACK", "LEFT", "RIGHT"].map((viewName) => {
                        const matchingIndex = product.views?.findIndex(
                          (v) => v.name.toUpperCase() === viewName
                        );
                        const loadedView = matchingIndex !== undefined && matchingIndex !== -1 ? product.views[matchingIndex] : null;
                        const isActiveView = matchingIndex !== undefined && matchingIndex !== -1 && activeViewIndex === matchingIndex;

                        return (
                          <div
                            key={viewName}
                            onClick={() => {
                              if (matchingIndex !== undefined && matchingIndex !== -1) {
                                setActiveViewIndex(matchingIndex);
                              }
                            }}
                            className={cn(
                              "p-3 rounded-xl border-2 transition-all shadow-sm flex flex-col items-center justify-between gap-2 group text-center bg-white relative overflow-hidden",
                              isActiveView
                                ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20"
                                : loadedView
                                ? "border-gray-200 hover:border-blue-400 cursor-pointer"
                                : "border-dashed border-gray-300 bg-gray-50/80"
                            )}
                          >
                            {/* View Header */}
                            <div className="w-full flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                {viewName}
                              </span>
                              {loadedView ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                  LOADED
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">
                                  PENDING
                                </span>
                              )}
                            </div>

                            {/* View Image Preview */}
                            <div className="h-20 w-full flex items-center justify-center my-1">
                              {loadedView?.svgUrl ? (
                                <img
                                  src={resolveUrl(loadedView.svgUrl)}
                                  alt={viewName}
                                  className="h-20 w-auto object-contain"
                                />
                              ) : (
                                <Layers className="h-8 w-8 text-gray-300" />
                              )}
                            </div>

                            {/* View Upload Button */}
                            <Button
                              size="sm"
                              variant={loadedView ? "ghost" : "outline"}
                              className="w-full text-[11px] h-7 cursor-pointer"
                              disabled={uploadingSvg}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveUploadViewName(viewName);
                                viewFileInputRef.current?.click();
                              }}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              {loadedView ? "Replace SVG" : `Upload ${viewName}`}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* COLORS TAB */}
                {activeTab === "colors" && (
                  <div className="flex flex-col gap-4">
                    {/* Layer Group Management System */}
                    <LayerGroupManager
                      groups={groups}
                      allParts={product.customizableParts || []}
                      colorMap={activeColorMap}
                      selectedLayerIds={selectedLayerIds}
                      activeSvgClickedId={selectedLayerIds.length > 0 ? selectedLayerIds[selectedLayerIds.length - 1] : null}
                      onCreateGroup={createGroup}
                      onSelectGroup={selectGroup}
                      onToggleLock={toggleGroupLock}
                      onToggleVisibility={toggleGroupVisibility}
                      onDeleteGroup={deleteGroup}
                      onDuplicateGroup={duplicateGroup}
                      onSelectLayer={(id) => handleLayerSelect(id, false, false)}
                      onRenameLayer={renameLayerLabel}
                      onRemoveLayer={removeLayerFromGroup}
                      onAssignLayers={assignLayersToGroup}
                      onLiveSelectionChange={(selectedIds) => setSelectedLayerIds(selectedIds)}
                      onGroupColorChange={(groupId, newColor) => {
                        const targetGroup = groups.find((g) => g.id === groupId);
                        if (!targetGroup) return;
                        setLayerColors((prev) => {
                          const next = { ...prev };
                          targetGroup.layers.forEach((l) => {
                            next[l.id] = newColor;
                          });
                          return next;
                        });
                      }}
                    />

                    {/* SVG Structure Manager */}
                    <SvgStructureManager
                      objects={(product.customizableParts || []).map((p) => ({
                        id: p.id,
                        name: p.label || p.id,
                        type:
                          (p as any).layerType ||
                          (p.id.startsWith("text_")
                            ? "TEXT"
                            : p.id.startsWith("image_")
                              ? "IMAGE"
                              : p.id.startsWith("group_")
                                ? "GROUP"
                                : "FILL"),
                        placeholder: (p as any).placeholder,
                        maxChars: (p as any).maxChars,
                        minChars: (p as any).minChars,
                        allowedFormats: (p as any).allowedFormats,
                        isEditable: p.isEditable,
                        isLocked: lockedLayerIds.includes(p.id) || Boolean(p.isLocked),
                        isHidden: hiddenLayerIds.includes(p.id),
                        color: activeColorMap[p.id] || p.defaultColor || "#FFFFFF",
                      }))}
                      selectedObjectIds={selectedLayerIds}
                      onSelectObject={(id, isMulti) => handleLayerSelect(id, Boolean(isMulti), false)}
                      onSelectAllObjects={(ids) => setSelectedLayerIds(ids)}
                      onClearSelection={() => handleClearSelection()}
                      onColorChange={(layerId, newColor) => {
                        setPreviewColors(null);
                        setLayerColors((prev) => ({ ...prev, [layerId]: newColor }));
                      }}
                      onToggleLock={toggleLayerLock}
                      onToggleVisibility={toggleLayerVisibility}
                      onUpdateObject={async (updated) => {
                        const mapping = (product as any).layerMappings?.find((m: any) => m.elementId === updated.id);
                        if (mapping) {
                          try {
                            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                            const res = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/admin/products/${product.id}/mappings/${mapping.id}`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                                },
                                body: JSON.stringify({
                                  placeholder: updated.placeholder,
                                  maxChars: updated.maxChars,
                                  minChars: updated.minChars,
                                  allowedFormatsJson: updated.allowedFormats,
                                  maxSizeBytes: updated.maxSizeBytes,
                                  isEditable: updated.isEditable,
                                  isLocked: updated.isLocked,
                                }),
                              }
                            );
                            if (res.ok) {
                              console.log(`Updated settings for ${updated.name}`);
                            }
                          } catch (err) {
                            console.error("Failed to update layer mapping:", err);
                          }
                        }
                      }}
                    />

                    {/* Batch & Single Color Customization Box */}
                    {selectedLayerIds.length > 0 ? (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-gray-800">
                              {selectedLayerIds.length === 1 ? (
                                <>Color for <span className="text-blue-600 font-extrabold">{partsMap[selectedLayerIds[0]] || selectedLayerIds[0]}</span></>
                              ) : (
                                <>Recolor <span className="text-blue-600 font-extrabold">{selectedLayerIds.length} Selected Layers</span></>
                              )}
                            </span>
                          </div>
                          <input
                            ref={colorInputRef}
                            type="color"
                            value={activeLayerColor}
                            onInput={(e) => handleBatchColorChange((e.target as HTMLInputElement).value)}
                            onChange={(e) => handleBatchColorChange((e.target as HTMLInputElement).value)}
                            className="h-8 w-14 border border-gray-300 rounded cursor-pointer p-0"
                          />
                        </div>

                        {/* Preset Swatches with Hover Live Preview */}
                        <div className="grid grid-cols-6 gap-2 pt-1">
                          {PRESET_COLORS.map((color, i) => (
                            <button
                              key={i}
                              onClick={() => handleBatchColorChange(color)}
                              onMouseEnter={() => handleSwatchHover(color)}
                              onMouseLeave={handleSwatchLeave}
                              className={cn(
                                "w-full aspect-square rounded-full shadow-xs border-2 transition-transform hover:scale-110 flex items-center justify-center relative",
                                activeLayerColor === color ? "border-blue-600 ring-2 ring-blue-600/30" : "border-gray-200"
                              )}
                              style={{ backgroundColor: color }}
                            >
                              {activeLayerColor === color && (
                                <Check className={cn("w-3.5 h-3.5", color === "#FFFFFF" ? "text-black" : "text-white")} />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-blue-50/50 text-blue-800 text-xs rounded-xl border border-blue-100 text-center font-medium">
                        Click any SVG layer on the garment or select layers above to customize colors.
                      </div>
                    )}
                  </div>
                )}

                {/* ELEMENTS TAB */}
                {activeTab === "elements" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-800 text-sm">Custom Graphics & Logos</h3>
                    <p className="text-xs text-gray-500 mb-2">Upload graphics to overlay on the product template.</p>

                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="mb-1 text-sm text-gray-600"><span className="font-semibold">Click to upload image</span></p>
                        <p className="text-xs text-gray-400">PNG, JPG, SVG (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}

                {/* TEXT TAB */}
                {activeTab === "text" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-800 text-sm">Add Custom Text</h3>

                    <div className="flex flex-col gap-4">
                      {/* Text Input */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Text Content</label>
                        <input
                          type="text"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                          placeholder="Enter text..."
                        />
                      </div>

                      {/* Font Family Selector (Dropdown) */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Font Family</label>
                        <select
                          value={textFontFamily}
                          onChange={(e) => {
                            const font = e.target.value;
                            setTextFontFamily(font);
                            canvasRef.current?.updateSelectedFont(font);
                          }}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
                        >
                          <option value="Oswald">Oswald</option>
                          <option value="Montserrat">Montserrat</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Impact">Impact</option>
                          <option value="Arial">Arial</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Trebuchet MS">Trebuchet MS</option>
                          <option value="Verdana">Verdana</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Comic Sans MS">Comic Sans</option>
                        </select>
                      </div>

                      {/* Font Weight Selector (Boldness) */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                          Font Weight
                        </label>
                        <div className="grid grid-cols-5 gap-1">
                          {[
                            { id: "normal", label: "Normal" },
                            { id: "500", label: "Medium" },
                            { id: "600", label: "Semi" },
                            { id: "bold", label: "Bold" },
                            { id: "900", label: "Black" },
                          ].map((w) => (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() => {
                                setTextFontWeight(w.id);
                                canvasRef.current?.updateSelectedFontWeight(w.id);
                              }}
                              className={cn(
                                "py-1 px-1.5 border rounded text-[11px] font-semibold text-center transition-all cursor-pointer",
                                textFontWeight === w.id
                                  ? "bg-blue-600 border-blue-600 text-white shadow-2xs"
                                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                              )}
                            >
                              {w.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Size Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-medium text-gray-600">Font Size</label>
                          <span className="text-xs font-bold text-blue-600">{textFontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="14"
                          max="96"
                          value={textFontSize}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTextFontSize(val);
                            canvasRef.current?.updateSelectedFontSize(val);
                          }}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                      </div>

                      {/* Text Color & Add Action */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Text Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => {
                              setTextColor(e.target.value);
                              canvasRef.current?.updateSelectedColor(e.target.value);
                            }}
                            className="h-10 w-16 border border-gray-200 p-0 rounded cursor-pointer"
                          />
                          <Button
                            className="flex-1 bg-black text-white hover:bg-gray-800"
                            onClick={handleAddText}
                          >
                            <TypeIcon className="w-4 h-4 mr-2" /> Add to Canvas
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <Button
                  className="w-full bg-black hover:bg-gray-900 text-white rounded-lg h-11 text-sm font-bold shadow-md"
                  onClick={handleSaveDesign}
                >
                  <Download className="w-4 h-4 mr-2" /> Export Design Preview
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
