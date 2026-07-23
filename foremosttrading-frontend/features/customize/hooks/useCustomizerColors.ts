import { useState } from "react";
import { KitColors } from "../types";

export function useCustomizerColors(initialColors: KitColors = {}) {
  const [colors, setColors] = useState<KitColors>(initialColors);
  const [lockedParts, setLockedParts] = useState<Record<string, boolean>>({});
  const [visibleParts, setVisibleParts] = useState<Record<string, boolean>>({});

  const handleColorChange = (partId: string, color: string) => {
    if (lockedParts[partId]) return;
    setColors((prev) => ({ ...prev, [partId]: color }));
  };

  const toggleLock = (partId: string) => {
    setLockedParts((prev) => ({ ...prev, [partId]: !prev[partId] }));
  };

  const toggleVisibility = (partId: string) => {
    setVisibleParts((prev) => ({ ...prev, [partId]: !prev[partId] }));
  };

  return {
    colors,
    setColors,
    lockedParts,
    visibleParts,
    handleColorChange,
    toggleLock,
    toggleVisibility,
  };
}
