"use client";

import { KitColors, PlayerText } from "../types";
import { cn } from "@/lib/utils";
import { getProductRenderer } from "../renderers";

interface KitPreviewProps {
  colors: KitColors;
  pattern: string;
  playerText: PlayerText;
  visibleParts: Record<string, boolean>;
  className?: string;
  productId?: string;
}

export function KitPreview({
  colors,
  pattern,
  playerText,
  visibleParts,
  className,
  productId = "soccer-jersey",
}: KitPreviewProps) {
  const Renderer = getProductRenderer(productId);

  return (
    <div className={cn("w-full bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between h-[350px] sm:h-[450px] lg:h-[650px] overflow-hidden", className)}>
      {/* Wrapped SVG defs in a hidden SVG element so they are valid SVG nodes inside HTML */}
      <svg className="hidden" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full flex-1 bg-gray-50 rounded-2xl p-4 md:p-8 flex flex-row items-center justify-center gap-2 md:gap-4 overflow-x-auto scrollbar-none overflow-hidden">
        <Renderer
          colors={colors}
          pattern={pattern}
          playerText={playerText}
          visibleParts={visibleParts}
        />
      </div>
    </div>
  );
}
