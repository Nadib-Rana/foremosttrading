"use client";

import { KitColors, PlayerText } from "../types";
import { cn } from "@/lib/utils";
import { getProductRenderer, DynamicSvgRenderer } from "../renderers";

interface KitPreviewProps {
  colors: KitColors;
  pattern: string;
  playerText: PlayerText;
  visibleParts: Record<string, boolean>;
  className?: string;
  productId?: string;
  /** Presigned MinIO URL for the product's uploaded SVG — when set, DynamicSvgRenderer is used */
  svgUrl?: string;
  isThumbnail?: boolean;
  selectedLayerId?: string | null;
  selectedLayerIds?: string[];
  onLayerSelect?: (elementId: string, isMultiSelect?: boolean, isRangeSelect?: boolean) => void;
}

export function KitPreview({
  colors,
  pattern,
  playerText,
  visibleParts,
  className,
  productId = "soccer-jersey",
  svgUrl,
  isThumbnail = false,
  selectedLayerId,
  selectedLayerIds,
  onLayerSelect,
}: KitPreviewProps) {
  // When a backend SVG URL is available, use the dynamic renderer
  const useDynamic = Boolean(svgUrl);
  const Renderer = getProductRenderer(productId);

  const renderContent = () => {
    if (useDynamic) {
      return (
        <DynamicSvgRenderer
          svgUrl={svgUrl!}
          colors={colors}
          playerText={playerText}
          visibleParts={visibleParts}
          pattern={pattern}
          selectedLayerId={selectedLayerId}
          selectedLayerIds={selectedLayerIds}
          onLayerSelect={onLayerSelect}
        />
      );
    }
    return (
      <Renderer
        colors={colors}
        pattern={pattern}
        playerText={playerText}
        visibleParts={visibleParts}
      />
    );
  };

  return (
    <>
      {/* Wrapped SVG defs in a hidden SVG element so they are valid SVG nodes inside HTML */}
      <svg className="hidden" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {isThumbnail ? (
        <div className={cn("w-full h-full bg-transparent flex flex-row items-center justify-center overflow-hidden", className)}>
          {renderContent()}
        </div>
      ) : (
        <div className={cn("w-full bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between h-[350px] sm:h-[450px] lg:h-[650px] overflow-hidden", className)}>
          <div className="w-full flex-1 bg-gray-50 rounded-2xl p-4 md:p-8 flex flex-row items-center justify-center gap-2 md:gap-4 overflow-x-auto scrollbar-none overflow-hidden">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}

