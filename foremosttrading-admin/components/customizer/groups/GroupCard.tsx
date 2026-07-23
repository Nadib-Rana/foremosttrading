"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Lock, Unlock, Eye, EyeOff, Trash2, Plus, Copy } from "lucide-react";
import { AdminLayerGroup } from "./types";
import { GroupLayerItem } from "./GroupLayerItem";

interface GroupCardProps {
  group: AdminLayerGroup;
  colorMap: Record<string, string>;
  selectedLayerIds: string[];
  onSelectGroup: (group: AdminLayerGroup) => void;
  onToggleLock: (groupId: string) => void;
  onToggleVisibility: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onDuplicateGroup: (group: AdminLayerGroup) => void;
  onSelectLayer: (layerId: string) => void;
  onRenameLayer: (layerId: string, newName: string) => void;
  onRemoveLayer: (groupId: string, layerId: string) => void;
  onAddLayerClick: (group: AdminLayerGroup) => void;
  onGroupColorChange?: (groupId: string, newColor: string) => void;
}

export function GroupCard({
  group,
  colorMap,
  selectedLayerIds,
  onSelectGroup,
  onToggleLock,
  onToggleVisibility,
  onDeleteGroup,
  onDuplicateGroup,
  onSelectLayer,
  onRenameLayer,
  onRemoveLayer,
  onAddLayerClick,
  onGroupColorChange,
}: GroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isGroupSelected = group.layers.length > 0 && group.layers.every((l) => selectedLayerIds.includes(l.id));

  // Determine group master color (first layer's color or #FFFFFF)
  const masterColor = group.layers.length > 0 ? colorMap[group.layers[0].id] || "#FFFFFF" : "#FFFFFF";

  return (
    <div className={`border rounded-lg bg-white overflow-hidden transition-shadow ${isGroupSelected ? "border-blue-400 shadow-xs ring-1 ring-blue-400/30" : "border-gray-200"}`}>
      {/* Group Header */}
      <div
        onClick={() => onSelectGroup(group)}
        className="flex items-center justify-between p-2.5 bg-gray-50/80 hover:bg-gray-100/80 cursor-pointer border-b border-gray-100"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 p-0 text-gray-500 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          {/* Master Group Color Controller */}
          <div
            className="relative w-5 h-5 rounded border border-gray-300 shadow-2xs cursor-pointer ring-2 ring-transparent hover:ring-blue-400 transition-all flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ backgroundColor: masterColor }}
            title={`Group Master Color: ${masterColor}`}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="color"
              value={masterColor}
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

        {/* Group Actions */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-gray-400 hover:text-blue-600"
            onClick={() => onToggleLock(group.id)}
            title={group.isLocked ? "Unlock Group" : "Lock Group"}
          >
            {group.isLocked ? <Lock className="h-3.5 w-3.5 text-amber-500" /> : <Unlock className="h-3.5 w-3.5" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-gray-400 hover:text-blue-600"
            onClick={() => onToggleVisibility(group.id)}
            title={group.isVisible ? "Hide Group" : "Show Group"}
          >
            {group.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-gray-400" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-gray-400 hover:text-blue-600"
            onClick={() => onDuplicateGroup(group)}
            title="Duplicate Group"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-gray-400 hover:text-emerald-600"
            onClick={() => onAddLayerClick(group)}
            title="Add Layer to Group"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-gray-400 hover:text-red-600"
            onClick={() => onDeleteGroup(group.id)}
            title="Delete Group"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Group Children Layers */}
      {isExpanded && (
        <div className="p-1.5 space-y-1 bg-white">
          {group.layers.length === 0 ? (
            <div className="text-[11px] text-gray-400 italic text-center py-2">No layers assigned yet</div>
          ) : (
            group.layers.map((layer) => (
              <GroupLayerItem
                key={layer.id}
                layer={layer}
                color={colorMap[layer.id]}
                isSelected={selectedLayerIds.includes(layer.id)}
                onSelect={onSelectLayer}
                onRename={onRenameLayer}
                onRemove={(layerId) => onRemoveLayer(group.id, layerId)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
