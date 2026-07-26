"use client";

import React from "react";
import { Layers } from "lucide-react";
import { CustomerLayerGroup } from "../types/groups";
import { CustomerGroupRow } from "./CustomerGroupRow";
import { CustomerLayerRow } from "./CustomerLayerRow";

interface CustomerLayerGroupPanelProps {
  groups: CustomerLayerGroup[];
  allParts: { id: string; label: string }[];
  colorMap: Record<string, string>;
  selectedLayerIds: string[];
  onSelectGroup: (group: CustomerLayerGroup) => void;
  onSelectLayer: (layerId: string) => void;
  onGroupColorChange?: (groupId: string, newColor: string) => void;
}

export function CustomerLayerGroupPanel({
  groups,
  allParts,
  colorMap,
  selectedLayerIds,
  onSelectGroup,
  onSelectLayer,
  onGroupColorChange,
}: CustomerLayerGroupPanelProps) {
  const assignedLayerIds = new Set(
    (groups || []).flatMap((g) => (g.layers || []).map((l: any) => l.id || l.elementId))
  );
  const unassignedParts = allParts.filter((p) => !assignedLayerIds.has(p.id));

  return (
    <div className="space-y-3">
      {/* Panel Header */}
      <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100">
        <Layers className="h-4 w-4 text-primary" />
        <span className="text-xs font-extrabold uppercase tracking-tight text-gray-900">
          Layer Groups
        </span>
      </div>

      {/* Layer Groups List */}
      <div className="space-y-2.5">
        {(groups || []).map((group) => (
          <CustomerGroupRow
            key={group.id}
            group={group}
            colorMap={colorMap}
            selectedLayerIds={selectedLayerIds}
            onSelectGroup={onSelectGroup}
            onSelectLayer={onSelectLayer}
            onGroupColorChange={onGroupColorChange}
          />
        ))}

        {/* Fallback Unassigned Layers */}
        {unassignedParts.length > 0 && (
          <div className="pt-2 border-t border-gray-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">
              Unassigned Parts
            </span>
            {unassignedParts.map((part) => (
              <CustomerLayerRow
                key={part.id}
                layer={{ id: part.id, displayLabel: part.label || part.id, displayOrder: 0 }}
                color={colorMap[part.id] || part.defaultColor || "#FFFFFF"}
                isSelected={selectedLayerIds.includes(part.id)}
                onSelect={onSelectLayer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
