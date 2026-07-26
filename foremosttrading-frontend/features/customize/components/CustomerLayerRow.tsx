"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerLayerItem } from "../types/groups";

interface CustomerLayerRowProps {
  layer: CustomerLayerItem;
  color: string;
  isSelected: boolean;
  onSelect: (layerId: string) => void;
}

export function CustomerLayerRow({
  layer,
  color = "#FFFFFF",
  isSelected,
  onSelect,
}: CustomerLayerRowProps) {
  const layerId = (layer && (layer.id || (layer as any).elementId)) || "layer";
  const labelText =
    (layer && (layer.displayLabel || (layer as any).layerName || (layer as any).label || layer.id || (layer as any).elementId)) ||
    "Layer";
  const displayColor = color || (layer && (layer as any).defaultColor) || "#FFFFFF";
  const swatchBgColor = displayColor.startsWith("url(") ? "#EF892A" : displayColor;
  const colorSubtitle = displayColor.startsWith("url(") ? "Gradient" : displayColor;

  return (
    <div
      onClick={() => onSelect(layerId)}
      className={`flex items-center justify-between p-2 pl-6 text-xs rounded-md transition-colors cursor-pointer border ${
        isSelected ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "bg-white border-transparent hover:bg-gray-50 text-gray-800"
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(layerId)}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="w-4 h-4 rounded border border-gray-300 shadow-2xs flex-shrink-0"
          style={{ backgroundColor: swatchBgColor }}
        />
        <span className="truncate font-semibold text-gray-900">{labelText}</span>
      </div>

      <span className="text-[10px] text-gray-500 font-mono truncate max-w-[70px]">
        {colorSubtitle}
      </span>
    </div>
  );
}
