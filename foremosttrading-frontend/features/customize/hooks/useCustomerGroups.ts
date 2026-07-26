"use client";

import { useState, useCallback } from "react";
import { CustomerLayerGroup } from "../types/groups";

export function useCustomerGroups(initialGroups: CustomerLayerGroup[] = []) {
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);

  // Select Group -> Selects all child layers in group
  const selectGroup = useCallback((group: CustomerLayerGroup) => {
    const childIds = (group.layers || []).map((l: any) => l.id || l.elementId);
    setSelectedLayerIds(childIds);
  }, []);

  // Select individual layer
  const selectLayer = useCallback((layerId: string, isMulti: boolean = false) => {
    setSelectedLayerIds((prev) => {
      if (isMulti) {
        return prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId];
      }
      return [layerId];
    });
  }, []);

  return {
    selectedLayerIds,
    setSelectedLayerIds,
    selectGroup,
    selectLayer,
  };
}
