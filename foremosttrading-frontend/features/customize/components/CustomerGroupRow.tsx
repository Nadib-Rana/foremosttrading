"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Lock, Palette } from "lucide-react";
import { CustomerLayerGroup } from "../types/groups";
import { CustomerLayerRow } from "./CustomerLayerRow";
import { COLOR_SWATCHES } from "../constants";

interface CustomerGroupRowProps {
  group: CustomerLayerGroup;
  colorMap: Record<string, string>;
  selectedLayerIds: string[];
  onSelectGroup: (group: CustomerLayerGroup) => void;
  onSelectLayer: (layerId: string) => void;
  onGroupColorChange?: (groupId: string, newColor: string) => void;
}

function formatLabel(raw: string): string {
  if (!raw) return "Layer";
  const spaced = raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();
  return spaced
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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
  const safeLayers = group.layers || [];
  const isGroupSelected = safeLayers.length > 0 && safeLayers.every((l: any) => selectedLayerIds.includes(l.id || l.elementId));

  // Determine group representative color (first layer's color)
  const firstLayer = safeLayers.length > 0 ? safeLayers[0] : null;
  const firstLayerId = firstLayer ? (firstLayer.id || (firstLayer as any).elementId) : "";
  const groupColor = firstLayerId ? colorMap[firstLayerId] || "#FFFFFF" : "#FFFFFF";
  const displayName = formatLabel(group.name || group.id);

  return (
    <div className={`border rounded-xl bg-white overflow-hidden transition-all ${isGroupSelected ? "border-primary ring-2 ring-primary/20 shadow-xs" : "border-gray-200 hover:border-gray-300"}`}>
      {/* Group Row Header */}
      <div
        onClick={() => onSelectGroup(group)}
        className="flex items-center justify-between p-3 bg-gray-50/90 hover:bg-gray-100/90 cursor-pointer border-b border-gray-100 select-none gap-2"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button
            type="button"
            className="p-0.5 text-gray-500 hover:text-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {/* Group Color Controller Swatch */}
          <div
            className="relative w-5 h-5 rounded-md border border-gray-300 shadow-2xs cursor-pointer ring-2 ring-transparent hover:ring-primary/40 transition-all shrink-0 overflow-hidden"
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

          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-xs uppercase tracking-wider text-gray-900 truncate">{displayName}</span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-tight">{groupColor}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {safeLayers.length > 1 && (
            <span className="text-[10px] bg-gray-200/80 text-gray-700 px-1.5 py-0.5 rounded-full font-bold">
              {safeLayers.length}
            </span>
          )}
          {group.isLocked && <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" title="Locked" />}
        </div>
      </div>

      {/* Child Layer List & Color Swatches when expanded */}
      {isExpanded && (
        <div className="p-3 space-y-3 bg-white border-t border-gray-100">
          {/* Quick Color Swatches for the Group */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-gray-100">
            {COLOR_SWATCHES.map((swatch) => {
              const isActive = groupColor.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => onGroupColorChange && onGroupColorChange(group.id, swatch.hex)}
                  style={{ backgroundColor: swatch.hex }}
                  className={`w-6 h-6 rounded-full border cursor-pointer transition-all hover:scale-110 shadow-2xs ${
                    isActive ? "border-primary ring-2 ring-primary/40 scale-105" : "border-gray-300 hover:border-gray-500"
                  }`}
                  title={swatch.name}
                />
              );
            })}
            <div className="relative w-6 h-6 rounded-full border border-gray-300 hover:border-gray-500 overflow-hidden cursor-pointer bg-white flex items-center justify-center shadow-2xs transition-transform hover:scale-110">
              <input
                type="color"
                value={groupColor}
                onChange={(e) => onGroupColorChange && onGroupColorChange(group.id, e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Palette className="w-3.5 h-3.5 text-gray-600 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            {safeLayers.map((layer: any) => {
              const lid = layer.id || layer.elementId;
              const rawLabel = layer.displayLabel || layer.layerName || layer.label || lid;
              return (
                <CustomerLayerRow
                  key={lid}
                  layer={{ ...layer, id: lid, displayLabel: formatLabel(rawLabel) }}
                  color={colorMap[lid] || layer.defaultColor || "#FFFFFF"}
                  isSelected={selectedLayerIds.includes(lid)}
                  onSelect={onSelectLayer}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
