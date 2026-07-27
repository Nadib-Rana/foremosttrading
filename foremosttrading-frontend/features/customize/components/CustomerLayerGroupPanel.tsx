"use client";

import React from "react";
import { Layers } from "lucide-react";
import { CustomerLayerGroup } from "../types/groups";
import { CustomerGroupRow } from "./CustomerGroupRow";
import { ColorPartRow } from "./ColorPartRow";

interface CustomerLayerGroupPanelProps {
  groups: CustomerLayerGroup[];
  allParts: { id: string; label: string; defaultColor?: string }[];
  colorMap: Record<string, string>;
  selectedLayerIds: string[];
  onSelectGroup: (group: CustomerLayerGroup) => void;
  onSelectLayer: (layerId: string) => void;
  onGroupColorChange?: (groupId: string, newColor: string) => void;
  onChangeColor?: (partId: string, newColor: string) => void;
  lockedParts?: Record<string, boolean>;
  toggleLock?: (partId: string) => void;
  visibleParts?: Record<string, boolean>;
  toggleVisibility?: (partId: string) => void;
  activePartToEdit?: string | null;
  setActivePartToEdit?: (partId: string | null) => void;
}

export function CustomerLayerGroupPanel({
  groups,
  allParts,
  colorMap,
  selectedLayerIds,
  onSelectGroup,
  onSelectLayer,
  onGroupColorChange,
  onChangeColor,
  lockedParts = {},
  toggleLock = () => {},
  visibleParts = {},
  toggleVisibility = () => {},
  activePartToEdit = null,
  setActivePartToEdit = () => {},
}: CustomerLayerGroupPanelProps) {
  const safeGroups = (groups || []).filter(
    (g) => Array.isArray(g.layers) && g.layers.length > 0
  );

  const assignedLayerIds = new Set(
    safeGroups.flatMap((g) => (g.layers || []).map((l: any) => l.id || l.elementId))
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
        {safeGroups.map((group) => (
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

        {/* Fallback & Ungrouped Layers */}
        {unassignedParts.length > 0 && (
          <div className="pt-3 border-t border-gray-200 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                Ungrouped Parts
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">
                {unassignedParts.length}
              </span>
            </div>
            {unassignedParts.map((part) => {
              const isExpanded = activePartToEdit === part.id;
              const isLocked = Boolean(lockedParts[part.id]);
              const isVisible = visibleParts[part.id] !== false;

              return (
                <ColorPartRow
                  key={part.id}
                  part={part}
                  color={colorMap[part.id] || part.defaultColor || "#FFFFFF"}
                  isExpanded={isExpanded}
                  isLocked={isLocked}
                  isVisible={isVisible}
                  onToggleExpand={() => !isLocked && setActivePartToEdit(isExpanded ? null : part.id)}
                  onToggleLock={() => toggleLock(part.id)}
                  onToggleVisibility={() => toggleVisibility(part.id)}
                  onChangeColor={(color) => onChangeColor ? onChangeColor(part.id, color) : null}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
