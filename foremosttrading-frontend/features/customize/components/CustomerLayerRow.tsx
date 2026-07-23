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
  return (
    <div
      onClick={() => onSelect(layer.id)}
      className={`flex items-center justify-between p-2 pl-6 text-xs rounded-md transition-colors cursor-pointer border ${
        isSelected ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "bg-white border-transparent hover:bg-gray-50 text-gray-700"
      }`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(layer.id)}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="w-4 h-4 rounded border border-gray-300 shadow-2xs flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="truncate font-medium text-gray-800">{layer.displayLabel || layer.id}</span>
      </div>

      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[70px]">
        {color}
      </span>
    </div>
  );
}
