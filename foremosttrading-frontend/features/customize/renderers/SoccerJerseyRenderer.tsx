"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { ProductColors, PlayerText } from "../types";
import { Loader2 } from "lucide-react";

interface SoccerJerseyRendererProps {
  colors: ProductColors;
  pattern: string;
  playerText: PlayerText;
  visibleParts: Record<string, boolean>;
}

export function SoccerJerseyRenderer({
  colors,
  pattern,
  playerText,
  visibleParts,
}: SoccerJerseyRendererProps) {
  const getStyle = (part: string) => {
    return visibleParts[part] ? {} : { display: "none" };
  };

  const renderPattern = () => {
    if (!visibleParts.borders) return null;
    if (pattern === "striped") {
      return (
        <g opacity="0.3" style={getStyle("jerseyBody")}>
          <rect x="110" y="70" width="15" height="150" fill={colors.borders} />
          <rect x="145" y="70" width="15" height="150" fill={colors.borders} />
          <rect x="180" y="70" width="15" height="150" fill={colors.borders} />
        </g>
      );
    }
    if (pattern === "sash") {
      return (
        <path
          d="M 90 70 L 195 210 L 210 210 L 110 70 Z"
          fill={colors.borders}
          opacity="0.5"
          style={getStyle("jerseyBody")}
        />
      );
    }
    if (pattern === "gradients") {
      return (
        <rect
          x="80"
          y="70"
          width="140"
          height="140"
          fill="url(#grad)"
          style={{ mixBlendMode: "overlay", ...getStyle("jerseyBody") }}
        />
      );
    }
    if (pattern === "modern") {
      return (
        <path
          d="M 80 70 L 150 70 L 80 180 Z"
          fill={colors.borders}
          opacity="0.25"
          style={getStyle("jerseyBody")}
        />
      );
    }
    return null;
  };

  return (
    <>
      {/* 1. LEFT SIDE VIEW */}
      <svg viewBox="0 0 300 400" className="w-[22%] min-w-[70px] max-h-[300px] h-auto flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Side Jersey */}
        <path d="M 120 70 L 160 70 L 170 210 L 110 210 Z" fill={colors.jerseyBody} style={getStyle("jerseyBody")} />
        {/* Sleeve side */}
        <path d="M 105 85 L 135 70 L 125 140 Z" fill={colors.borders} style={getStyle("borders")} />
        {/* Shorts side */}
        <path d="M 115 210 L 165 210 L 170 280 L 110 280 Z" fill={colors.pantBody} style={getStyle("pantBody")} />
        <rect x="135" y="210" width="8" height="70" fill={colors.borders} style={getStyle("borders")} />
        {/* Sock side */}
        <rect x="130" y="290" width="18" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="130" y="290" width="18" height="8" fill={colors.borders} style={getStyle("borders")} />
      </svg>

      {/* 2. FRONT VIEW */}
      <svg viewBox="0 0 300 400" className="w-[22%] min-w-[70px] max-h-[300px] h-auto flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Jersey Sleeves */}
        <path d="M 60 90 L 90 70 L 110 110 L 80 130 Z" fill={colors.borders} style={getStyle("borders")} />
        <path d="M 240 90 L 210 70 L 190 110 L 220 130 Z" fill={colors.borders} style={getStyle("borders")} />
        {/* Jersey Body */}
        <path d="M 90 70 C 120 70, 180 70, 210 70 L 220 210 L 80 210 Z" fill={colors.jerseyBody} style={getStyle("jerseyBody")} />
        {renderPattern()}
        {/* Collar */}
        <path d="M 130 70 C 140 85, 160 85, 170 70 Z" fill={colors.collar} style={getStyle("collar")} />
        
        {/* Text/Number Overlay */}
        {visibleParts.jerseyBody && (
          <text x="150" y="160" fill={playerText.textColor} fontFamily={playerText.fontFamily} fontSize="28" fontWeight="bold" textAnchor="middle" className="italic">
            {playerText.number}
          </text>
        )}

        {/* Shorts */}
        <path d="M 95 210 L 205 210 L 215 280 L 155 280 L 150 250 L 145 280 L 85 280 Z" fill={colors.pantBody} style={getStyle("pantBody")} />
        <path d="M 85 270 L 120 270 L 120 280 L 85 280 Z" fill={colors.borders} style={getStyle("borders")} />
        <path d="M 180 270 L 215 270 L 215 280 L 180 280 Z" fill={colors.borders} style={getStyle("borders")} />

        {/* Socks */}
        <rect x="100" y="290" width="16" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="184" y="290" width="16" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="100" y="290" width="16" height="8" fill={colors.borders} style={getStyle("borders")} />
        <rect x="184" y="290" width="16" height="8" fill={colors.borders} style={getStyle("borders")} />
      </svg>

      {/* 3. BACK VIEW */}
      <svg viewBox="0 0 300 400" className="w-[22%] min-w-[70px] max-h-[300px] h-auto flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Jersey Sleeves */}
        <path d="M 60 90 L 90 70 L 110 110 L 80 130 Z" fill={colors.borders} style={getStyle("borders")} />
        <path d="M 240 90 L 210 70 L 190 110 L 220 130 Z" fill={colors.borders} style={getStyle("borders")} />
        {/* Jersey Body */}
        <path d="M 90 70 C 120 70, 180 70, 210 70 L 220 210 L 80 210 Z" fill={colors.jerseyBody} style={getStyle("jerseyBody")} />
        {renderPattern()}
        {/* Collar Back */}
        <path d="M 130 70 C 140 73, 160 73, 170 70 Z" fill={colors.collar} style={getStyle("collar")} />
        
        {visibleParts.jerseyBody && (
          <>
            <text x="150" y="110" fill={playerText.textColor} fontFamily={playerText.fontFamily} fontSize="12" fontWeight="black" textAnchor="middle" className="uppercase italic tracking-widest">
              {playerText.name}
            </text>
            <text x="150" y="165" fill={playerText.textColor} fontFamily={playerText.fontFamily} fontSize="46" fontWeight="black" textAnchor="middle" className="italic">
              {playerText.number}
            </text>
          </>
        )}

        {/* Shorts */}
        <path d="M 95 210 L 205 210 L 215 280 L 155 280 L 150 250 L 145 280 L 85 280 Z" fill={colors.pantBody} style={getStyle("pantBody")} />
        {/* Socks */}
        <rect x="100" y="290" width="16" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="184" y="290" width="16" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="100" y="290" width="16" height="8" fill={colors.borders} style={getStyle("borders")} />
        <rect x="184" y="290" width="16" height="8" fill={colors.borders} style={getStyle("borders")} />
      </svg>

      {/* 4. RIGHT SIDE VIEW */}
      <svg viewBox="0 0 300 400" className="w-[22%] min-w-[70px] max-h-[300px] h-auto flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Side Jersey */}
        <path d="M 120 70 L 160 70 L 170 210 L 110 210 Z" fill={colors.jerseyBody} style={getStyle("jerseyBody")} />
        {/* Sleeve side */}
        <path d="M 175 85 L 145 70 L 155 140 Z" fill={colors.borders} style={getStyle("borders")} />
        {/* Shorts side */}
        <path d="M 115 210 L 165 210 L 170 280 L 110 280 Z" fill={colors.pantBody} style={getStyle("pantBody")} />
        <rect x="135" y="210" width="8" height="70" fill={colors.borders} style={getStyle("borders")} />
        {/* Sock side */}
        <rect x="130" y="290" width="18" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="130" y="290" width="18" height="8" fill={colors.borders} style={getStyle("borders")} />
      </svg>
    </>
  );
}

// ─── DynamicSvgRenderer ─────────────────────────────────────────────────────
// Backend-driven SVG customizer renderer.
// Fetches the SVG from the backend-issued presigned MinIO URL, then patches
// colour and visibility for every element whose id matches a backend-resolved
// layer elementId from parseSvg().
//
// Architecture invariant: Frontend NEVER parses SVG structure. Only applies
// color patches to elements whose IDs were discovered by the backend.

interface DynamicSvgRendererProps {
  svgUrl: string;
  colors: ProductColors;
  playerText: PlayerText;
  visibleParts: Record<string, boolean>;
  pattern?: string;
  selectedLayerId?: string | null;
  selectedLayerIds?: string[];
  onLayerSelect?: (elementId: string, isMultiSelect?: boolean, isRangeSelect?: boolean) => void;
}

const SUPPORTED_TAGS = ["path", "rect", "circle", "ellipse", "polygon", "polyline", "line", "text", "image", "use", "g"];

export function DynamicSvgRenderer({
  svgUrl,
  colors,
  playerText,
  visibleParts,
  selectedLayerId,
  selectedLayerIds = [],
  onLayerSelect,
}: DynamicSvgRendererProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgUrl) return;
    setLoading(true);
    setError(null);
    fetch(svgUrl)
      .then((res) => {
        if (!res.ok) throw new Error("SVG load failed (" + res.status + ")");
        return res.text();
      })
      .then((text) => {
        setSvgContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[DynamicSvgRenderer] fetch error:", err);
        setError("Failed to load product SVG.");
        setLoading(false);
      });
  }, [svgUrl]);

  const activeSelectedIds = selectedLayerIds.length > 0 
    ? selectedLayerIds 
    : (selectedLayerId ? [selectedLayerId] : []);

  const applyPatches = useCallback(() => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector("svg");
    if (!svgEl) return;

    Object.entries(colors).forEach(([elementId, color]) => {
      const el = svgEl.querySelector("#" + CSS.escape(elementId)) as HTMLElement | SVGElement | null;
      if (!el) return;
      el.style.cursor = "pointer";
      el.style.filter = "";
      el.style.outline = "";

      const stroke = el.getAttribute("stroke");
      const fill = el.getAttribute("fill");
      if (stroke && stroke !== "none" && (!fill || fill === "none")) {
        el.setAttribute("stroke", color);
      } else {
        el.setAttribute("fill", color);
        el.querySelectorAll(SUPPORTED_TAGS.join(",")).forEach((c) => {
          const cf = c.getAttribute("fill");
          if (cf && cf !== "none") c.setAttribute("fill", color);
        });
      }
    });

    if (activeSelectedIds.length > 0) {
      activeSelectedIds.forEach((id) => {
        const selectedEl = svgEl.querySelector("#" + CSS.escape(id)) as HTMLElement | SVGElement | null;
        if (selectedEl) {
          selectedEl.style.filter = "drop-shadow(0 0 5px #2563eb) drop-shadow(0 0 10px #3b82f6)";
          selectedEl.style.outline = "2px solid #3b82f6";
          selectedEl.style.transition = "filter 0.15s ease-in-out, outline 0.15s ease-in-out";
        }
      });
    }

    Object.entries(visibleParts).forEach(([elementId, visible]) => {
      const el = svgEl.querySelector("#" + CSS.escape(elementId)) as HTMLElement | null;
      if (!el) return;
      el.style.display = visible ? "" : "none";
    });

    svgEl.setAttribute("width", "100%");
    svgEl.setAttribute("height", "100%");
    svgEl.style.width = "100%";
    svgEl.style.height = "100%";
    svgEl.style.maxWidth = "100%";
    svgEl.style.maxHeight = "100%";
  }, [colors, visibleParts, activeSelectedIds]);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;
    containerRef.current.innerHTML = svgContent;
    applyPatches();

    const svgEl = containerRef.current.querySelector("svg");
    if (!svgEl) return;

    const handleClick = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;
      while (target && target !== svgEl) {
        const id = target.getAttribute("id");
        if (id && colors.hasOwnProperty(id)) {
          if (onLayerSelect) {
            const isMulti = e.ctrlKey || e.metaKey;
            const isRange = e.shiftKey;
            onLayerSelect(id, isMulti, isRange);
          }
          break;
        }
        target = target.parentElement;
      }
    };

    svgEl.addEventListener("click", handleClick);
    return () => {
      svgEl.removeEventListener("click", handleClick);
    };
  }, [svgContent, applyPatches, colors, onLayerSelect]);

  useEffect(() => {
    if (!svgContent) return;
    applyPatches();
  }, [colors, visibleParts, selectedLayerId, applyPatches, svgContent]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-3 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-xs font-medium">Loading product preview…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 text-red-400">
        <span className="text-sm font-semibold">Preview unavailable</span>
        <span className="text-xs text-gray-400">{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
      aria-label="Product SVG preview"
    />
  );
}

