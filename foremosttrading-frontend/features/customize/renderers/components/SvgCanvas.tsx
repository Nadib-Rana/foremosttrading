import React, { useRef, useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DynamicSvgRendererProps } from "../types/svg";
import { useSvgRenderer } from "../hooks/useSvgRenderer";
import { useSvgListeners } from "../hooks/useSvgListeners";
import { applyColorPatches } from "../utils/applyColorPatch";
import { applyTextPatches } from "../utils/applyTextPatch";
import { applySelectionPatch } from "../utils/applySelectionPatch";
import { applyVisibilityPatches, setupSvgDimensions } from "../utils/svgDomUtils";
import { extractSvgLayers } from "../utils/extractSvgLayers";
import { injectFabricFilter } from "../utils/injectFabricFilter";
import { LayerTooltip } from "./LayerTooltip";
import { MockupToolbar } from "./MockupToolbar";
import { FabricTextureOverlay } from "./FabricTextureOverlay";

export function SvgCanvas({
  svgUrl,
  svgRaw,
  colors,
  playerText,
  visibleParts,
  selectedLayerId,
  selectedLayerIds = [],
  onLayerSelect,
  onLayersDetected,
  onError,
}: DynamicSvgRendererProps) {
  const { svgContent, loading, error } = useSvgRenderer(svgUrl, svgRaw);

  useEffect(() => {
    if (error && onError) onError();
  }, [error, onError]);

  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [isRealisticMode, setIsRealisticMode] = useState<boolean>(true);
  const [fabricTexture, setFabricTexture] = useState<"mesh" | "cotton" | "smooth">("mesh");

  const activeSelectedIds = selectedLayerIds.length > 0
    ? selectedLayerIds
    : selectedLayerId
    ? [selectedLayerId]
    : [];

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

    svgEl.style.filter = isRealisticMode
      ? "drop-shadow(0px 18px 25px rgba(0,0,0,0.22))"
      : "none";
  }, [colors, playerText, visibleParts, activeSelectedIds, isRealisticMode]);

  const onLayersDetectedRef = useRef(onLayersDetected);
  useEffect(() => {
    onLayersDetectedRef.current = onLayersDetected;
  }, [onLayersDetected]);

  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;
    svgContainerRef.current.innerHTML = svgContent;

    const svgEl = svgContainerRef.current.querySelector("svg");
    if (svgEl && onLayersDetectedRef.current) {
      const cacheKey = svgUrl || (svgContent.length > 500 ? svgContent.slice(0, 200) : svgContent);
      const detected = extractSvgLayers(svgEl, cacheKey);
      if (detected.length > 0) {
        onLayersDetectedRef.current(detected);
      }
    }

    applyPatches();
  }, [svgContent, applyPatches, svgUrl]);

  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;
    applyPatches();
  }, [colors, activeSelectedIds, visibleParts, applyPatches, svgContent, isRealisticMode]);

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
      <div className="w-full h-full flex items-center justify-center relative p-4 transition-all duration-300">
        <div
          ref={svgContainerRef}
          className={`w-full h-full flex items-center justify-center transition-all duration-300 [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-full [&>svg]:h-full ${
            isRealisticMode ? "drop-shadow-[0_25px_35px_rgba(0,0,0,0.28)]" : ""
          }`}
        />
        <FabricTextureOverlay isRealisticMode={isRealisticMode} fabricTexture={fabricTexture} />
      </div>

      <MockupToolbar
        isRealisticMode={isRealisticMode}
        setIsRealisticMode={setIsRealisticMode}
        fabricTexture={fabricTexture}
        setFabricTexture={setFabricTexture}
      />

      <LayerTooltip badge={hoveredBadge} />
    </div>
  );
}
