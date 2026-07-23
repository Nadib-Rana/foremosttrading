"use client";

import { useState, useCallback } from "react";
import { AdminLayerGroup, GroupLayer, CustomizablePart } from "./types";

export function useLayerGroups(initialParts: CustomizablePart[] = []) {
  const [groups, setGroups] = useState<AdminLayerGroup[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);

  // Create a new layer group
  const createGroup = useCallback((name: string, layerIds: string[] = []) => {
    const newGroup: AdminLayerGroup = {
      id: "group_" + Date.now(),
      name,
      isLocked: false,
      isVisible: true,
      displayOrder: groups.length,
      layers: layerIds.map((id, index) => ({
        id,
        displayLabel: initialParts.find((p) => p.id === id)?.label || id,
        displayOrder: index,
      })),
    };
    setGroups((prev) => [...prev, newGroup]);
  }, [groups.length, initialParts]);

  // Rename a group
  const renameGroup = useCallback((groupId: string, newName: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, name: newName } : g))
    );
  }, []);

  // Toggle group lock state
  const toggleGroupLock = useCallback((groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, isLocked: !g.isLocked } : g))
    );
  }, []);

  // Toggle group visibility
  const toggleGroupVisibility = useCallback((groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, isVisible: !g.isVisible } : g))
    );
  }, []);

  // Delete a group
  const deleteGroup = useCallback((groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }, []);

  // Duplicate a group
  const duplicateGroup = useCallback((group: AdminLayerGroup) => {
    const duplicated: AdminLayerGroup = {
      ...group,
      id: "group_" + Date.now(),
      name: `${group.name} (Copy)`,
      layers: group.layers.map((l) => ({ ...l })),
    };
    setGroups((prev) => [...prev, duplicated]);
  }, []);

  // Assign layers to group
  const assignLayersToGroup = useCallback((groupId: string, layerIds: string[]) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const existingIds = g.layers.map((l) => l.id);
        const newLayers: GroupLayer[] = layerIds
          .filter((id) => !existingIds.includes(id))
          .map((id, index) => ({
            id,
            displayLabel: initialParts.find((p) => p.id === id)?.label || id,
            displayOrder: g.layers.length + index,
          }));
        return { ...g, layers: [...g.layers, ...newLayers] };
      })
    );
  }, [initialParts]);

  // Rename individual layer displayLabel
  const renameLayerLabel = useCallback((layerId: string, newLabel: string) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        layers: g.layers.map((l) =>
          l.id === layerId ? { ...l, displayLabel: newLabel } : l
        ),
      }))
    );
  }, []);

  // Remove layer from group
  const removeLayerFromGroup = useCallback((groupId: string, layerId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, layers: g.layers.filter((l) => l.id !== layerId) }
          : g
      )
    );
  }, []);

  // Select group -> selects all child layers
  const selectGroup = useCallback((group: AdminLayerGroup) => {
    const childIds = group.layers.map((l) => l.id);
    setSelectedLayerIds(childIds);
  }, []);

  return {
    groups,
    setGroups,
    selectedLayerIds,
    setSelectedLayerIds,
    createGroup,
    renameGroup,
    toggleGroupLock,
    toggleGroupVisibility,
    deleteGroup,
    duplicateGroup,
    assignLayersToGroup,
    renameLayerLabel,
    removeLayerFromGroup,
    selectGroup,
  };
}
