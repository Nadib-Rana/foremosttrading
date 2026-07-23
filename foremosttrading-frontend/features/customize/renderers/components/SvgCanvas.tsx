import React, { useRef, useCallback, useEffect, useState } from "react";
import { Loader2, Sparkles, Layers, Eye } from "lucide-react";
import { DynamicSvgRendererProps } from "../types/svg";
import { useSvgRenderer } from "../hooks/useSvgRenderer";
import { useSvgListeners } from "../hooks/useSvgListeners";
import { applyColorPatches, applyTextPatches } from "../utils/applyColorPatch";
import { applySelectionPatch } from "../utils/applySelectionPatch";
import { applyVisibilityPatches, setupSvgDimensions } from "../utils/svgDomUtils";
import { LayerTooltip } from "./LayerTooltip";

export function SvgCanvas({
  svgUrl,
  colors,
  playerText,
  visibleParts,
  selectedLayerId,
  selectedLayerIds = [],
  onLayerSelect,
}: DynamicSvgRendererProps) {
  const { svgContent, loading, error } = useSvgRenderer(svgUrl);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [isRealisticMode, setIsRealisticMode] = useState<boolean>(true);
  const [fabricTexture, setFabricTexture] = useState<"mesh" | "cotton" | "smooth">("mesh");

  const activeSelectedIds = selectedLayerIds.length > 0
    ? selectedLayerIds
    : selectedLayerId
    ? [selectedLayerId]
    : [];

  const injectFabricFilter = (svgEl: SVGSVGElement) => {
    let defs = svgEl.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svgEl.insertBefore(defs, svgEl.firstChild);
    }

    // Ingest SVG noise & specular shading filter for Figma-grade photorealism
    let filter = defs.querySelector("#photorealistic-fabric-filter");
    if (!filter) {
      filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
      filter.setAttribute("id", "photorealistic-fabric-filter");
      filter.setAttribute("x", "-5%");
      filter.setAttribute("y", "-5%");
      filter.setAttribute("width", "110%");
      filter.setAttribute("height", "110%");

      filter.innerHTML = `
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.12 0" in="noise" result="fabricNoise" />
        <feDiffuseLighting in="noise" lighting-color="#ffffff" surfaceScale="1.5" result="lightMap">
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
        <feBlend mode="multiply" in="SourceGraphic" in2="lightMap" result="shaded" />
        <feBlend mode="overlay" in="shaded" in2="fabricNoise" result="finalOutput" />
      `;
      defs.appendChild(filter);
    }
  };

  const applyPatches = useCallback(() => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector("svg");
    if (!svgEl) return;

    injectFabricFilter(svgEl);
    applySelectionPatch(svgEl, activeSelectedIds);
    applyColorPatches(svgEl, colors);
    if (playerText) applyTextPatches(svgEl, playerText as any);
    applyVisibilityPatches(svgEl, visibleParts);
    setupSvgDimensions(svgEl);

    // Apply or remove photorealistic texture filter
    if (isRealisticMode) {
      svgEl.style.filter = "drop-shadow(0px 18px 25px rgba(0,0,0,0.22))";
    } else {
      svgEl.style.filter = "none";
    }
  }, [colors, playerText, visibleParts, activeSelectedIds, isRealisticMode]);

  // 1. Ingest SVG Content into DOM ONCE when template changes
  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;
    svgContainerRef.current.innerHTML = svgContent;
    applyPatches();
  }, [svgContent, applyPatches]);

  // 2. Patch colors and selection overlays when selection or colors change
  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;
    applyPatches();
  }, [colors, activeSelectedIds, visibleParts, applyPatches, svgContent, isRealisticMode]);

  // 3. Attach event listeners
  const { hoveredBadge } = useSvgListeners({
    svgContainerRef,
    svgContent,
    colors,
    activeSelectedIds,
    onLayerSelect,
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-2 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-xs font-medium">Loading realistic 3D product mockup…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-amber-600 text-xs font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative group select-none">
      {/* Photorealistic Mockup Canvas Container with Ambient Occlusion Floor Shadow */}
      <div className="w-full h-full flex items-center justify-center relative p-4 transition-all duration-300">
        {/* Layer 1: Vector SVG Content */}
        <div
          ref={svgContainerRef}
          className={`w-full h-full flex items-center justify-center transition-all duration-300 [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-full [&>svg]:h-full ${
            isRealisticMode ? "drop-shadow-[0_25px_35px_rgba(0,0,0,0.28)]" : ""
          }`}
        />

        {/* Layer 2: Photorealistic 3D Crease & Lighting Overlay (Multiply & Soft-Light Shading) */}
        {isRealisticMode && (
          <>
            {/* Soft Fabric Lighting & Wrinkle Overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl mix-blend-multiply opacity-75 transition-opacity duration-300 bg-gradient-to-tr from-black/20 via-transparent to-white/10"
              style={{
                backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.25) 100%)`,
              }}
            />
            {/* Fabric Micro-Texture Grid Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-repeat"
              style={{
                backgroundImage:
                  fabricTexture === "mesh"
                    ? `radial-gradient(circle, #000 1px, transparent 1px)`
                    : `linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%)`,
                backgroundSize: fabricTexture === "mesh" ? "4px 4px" : "8px 8px",
              }}
            />
          </>
        )}
      </div>

      {/* Floating Toolbar: Mockup Quality & Realism Controls */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/15 p-1.5 rounded-full text-white shadow-xl opacity-90 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsRealisticMode(!isRealisticMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isRealisticMode
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
              : "bg-white/10 text-gray-300 hover:text-white"
          }`}
          title="Toggle Photorealistic 3D Mockup View"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isRealisticMode ? "Realistic 3D" : "Flat Vector"}</span>
        </button>

        {isRealisticMode && (
          <div className="flex items-center gap-1 px-1 border-l border-white/20">
            <button
              onClick={() => setFabricTexture("mesh")}
              className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
                fabricTexture === "mesh" ? "bg-white/30 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Mesh
            </button>
            <button
              onClick={() => setFabricTexture("cotton")}
              className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
                fabricTexture === "cotton" ? "bg-white/30 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Cotton
            </button>
          </div>
        )}
      </div>

      <LayerTooltip badge={hoveredBadge} />
    </div>
  );
}
