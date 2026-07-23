"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Lock } from "lucide-react";
import { CustomerLayerGroup } from "../types/groups";
import { CustomerLayerRow } from "./CustomerLayerRow";

interface CustomerGroupRowProps {
  group: CustomerLayerGroup;
  colorMap: Record<string, string>;
  selectedLayerIds: string[];
  onSelectGroup: (group: CustomerLayerGroup) => void;
  onSelectLayer: (layerId: string) => void;
  onGroupColorChange?: (groupId: string, newColor: string) => void;
}

export function CustomerGroupRow({
  group,
  colorMap,
  selectedLayerIds,
  onSelectGroup,
  onSelectLayer,
  onGroupColorChange,
}: CustomerGroupRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isGroupSelected = group.layers.length > 0 && group.layers.every((l) => selectedLayerIds.includes(l.id));

  // Determine group representative color (first layer's color)
  const groupColor = group.layers.length > 0 ? colorMap[group.layers[0].id] || "#FFFFFF" : "#FFFFFF";

  return (
    <div className={`border rounded-lg bg-white overflow-hidden transition-all ${isGroupSelected ? "border-primary/50 shadow-xs" : "border-gray-200"}`}>
      {/* Group Row Header */}
      <div
        onClick={() => onSelectGroup(group)}
        className="flex items-center justify-between p-2.5 bg-gray-50/80 hover:bg-gray-100/80 cursor-pointer border-b border-gray-100"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            type="button"
            className="p-0 text-gray-500 hover:text-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {/* Group Color Controller Swatch */}
          <div
            className="relative w-4 h-4 rounded border border-gray-300 shadow-2xs cursor-pointer ring-2 ring-transparent hover:ring-primary/40 transition-all flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: groupColor }}
            title={`Group Master Color: ${groupColor}`}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="color"
              value={groupColor}
              onInput={(e) => {
                if (onGroupColorChange) {
                  onGroupColorChange(group.id, (e.target as HTMLInputElement).value);
                }
              }}
              onChange={(e) => {
                if (onGroupColorChange) {
                  onGroupColorChange(group.id, e.target.value);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <span className="font-bold text-xs uppercase tracking-wider text-gray-800 truncate">{group.name}</span>
          <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full font-semibold">
            {group.layers.length}
          </span>
        </div>

        {group.isLocked && <Lock className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" title="Locked" />}
      </div>

      {/* Child Layer List */}
      {isExpanded && (
        <div className="p-1.5 space-y-1 bg-white">
          {group.layers.map((layer) => (
            <CustomerLayerRow
              key={layer.id}
              layer={layer}
              color={colorMap[layer.id]}
              isSelected={selectedLayerIds.includes(layer.id)}
              onSelect={onSelectLayer}
            />
          ))}
        </div>
      )}
    </div>
  );
}
