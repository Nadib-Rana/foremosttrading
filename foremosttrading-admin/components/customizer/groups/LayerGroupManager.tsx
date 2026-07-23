"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus, Layers } from "lucide-react";
import { AdminLayerGroup, CustomizablePart } from "./types";
import { GroupCard } from "./GroupCard";
import { CreateGroupModal } from "./CreateGroupModal";

interface LayerGroupManagerProps {
  groups: AdminLayerGroup[];
  allParts: CustomizablePart[];
  colorMap: Record<string, string>;
  selectedLayerIds: string[];
  activeSvgClickedId?: string | null;
  onCreateGroup: (name: string, layerIds: string[]) => void;
  onSelectGroup: (group: AdminLayerGroup) => void;
  onToggleLock: (groupId: string) => void;
  onToggleVisibility: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onDuplicateGroup: (group: AdminLayerGroup) => void;
  onSelectLayer: (layerId: string) => void;
  onRenameLayer: (layerId: string, newName: string) => void;
  onRemoveLayer: (groupId: string, layerId: string) => void;
  onAssignLayers: (groupId: string, layerIds: string[]) => void;
  onLiveSelectionChange?: (selectedIds: string[]) => void;
  onHoverLayer?: (layerId: string | null) => void;
  onGroupColorChange?: (groupId: string, newColor: string) => void;
}

export function LayerGroupManager({
  groups,
  allParts,
  colorMap,
  selectedLayerIds,
  activeSvgClickedId,
  onCreateGroup,
  onSelectGroup,
  onToggleLock,
  onToggleVisibility,
  onDeleteGroup,
  onDuplicateGroup,
  onSelectLayer,
  onRenameLayer,
  onRemoveLayer,
  onAssignLayers,
  onLiveSelectionChange,
  onHoverLayer,
  onGroupColorChange,
}: LayerGroupManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeGroupForAdd, setActiveGroupForAdd] = useState<AdminLayerGroup | null>(null);

  const assignedLayerIds = new Set(groups.flatMap((g) => g.layers.map((l) => l.id)));
  const unassignedParts = allParts.filter((p) => !assignedLayerIds.has(p.id));

  const handleOpenAddModal = (group: AdminLayerGroup) => {
    setActiveGroupForAdd(group);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (groupName: string, selectedIds: string[]) => {
    if (activeGroupForAdd) {
      onAssignLayers(activeGroupForAdd.id, selectedIds);
      setActiveGroupForAdd(null);
    } else {
      onCreateGroup(groupName, selectedIds);
    }
  };

  return (
    <div className="space-y-3">
      {/* Create Group Action Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-xs font-extrabold uppercase tracking-tight text-gray-900">
            Layer Groups ({groups.length})
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs px-2.5 bg-white hover:bg-gray-50 border-gray-200 shadow-2xs font-semibold"
          onClick={() => {
            setActiveGroupForAdd(null);
            setIsModalOpen(true);
          }}
        >
          <FolderPlus className="h-3.5 w-3.5 mr-1 text-primary" /> Add Group
        </Button>
      </div>

      {/* Group List */}
      {groups.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
          <Layers className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-gray-600">No Layer Groups Created</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Organize detected raw vector layers into human-friendly groups (e.g. Body, Sleeves, Collar).
          </p>
          <Button
            size="sm"
            className="mt-3 text-xs h-8"
            onClick={() => {
              setActiveGroupForAdd(null);
              setIsModalOpen(true);
            }}
          >
            <FolderPlus className="h-3.5 w-3.5 mr-1" /> Create First Group
          </Button>
        </div>
      ) : (
        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              colorMap={colorMap}
              selectedLayerIds={selectedLayerIds}
              onSelectGroup={onSelectGroup}
              onToggleLock={onToggleLock}
              onToggleVisibility={onToggleVisibility}
              onDeleteGroup={onDeleteGroup}
              onDuplicateGroup={onDuplicateGroup}
              onSelectLayer={onSelectLayer}
              onRenameLayer={onRenameLayer}
              onRemoveLayer={onRemoveLayer}
              onAddLayerClick={handleOpenAddModal}
              onGroupColorChange={onGroupColorChange}
            />
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <CreateGroupModal
        isOpen={isModalOpen}
        unassignedParts={unassignedParts}
        activeSvgClickedId={activeSvgClickedId}
        onClose={() => {
          setIsModalOpen(false);
          setActiveGroupForAdd(null);
        }}
        onCreate={handleModalSubmit}
        onLiveSelectionChange={onLiveSelectionChange}
        onHoverLayer={onHoverLayer}
      />
    </div>
  );
}
