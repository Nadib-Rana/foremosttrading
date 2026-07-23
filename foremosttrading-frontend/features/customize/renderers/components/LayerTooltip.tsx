import React from "react";
import { HoveredBadgeState } from "../types/svg";

interface LayerTooltipProps {
  badge: HoveredBadgeState | null;
}

export function LayerTooltip({ badge }: LayerTooltipProps) {
  if (!badge) return null;

  return (
    <div
      className="absolute z-30 pointer-events-none bg-gray-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xl backdrop-blur-xs transition-transform transform -translate-x-1/2 -translate-y-full border border-white/20 whitespace-nowrap flex items-center gap-1.5"
      style={{ left: badge.x, top: badge.y - 8 }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      Layer: {badge.label}
    </div>
  );
}
