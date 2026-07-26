"use client";

import { useState, useCallback } from "react";
import { CustomizerTab, KitColors, DesignPattern, ProductSchema } from "../types";
import { SOCCER_JERSEY_SCHEMA } from "../schemas/soccerJerseySchema";
import { saveProductConfiguration } from "../api/customizeApi";
import { usePlayerManagement } from "./usePlayerManagement";

export function useCustomize(schema: ProductSchema = SOCCER_JERSEY_SCHEMA) {
  const safeSchema = schema || SOCCER_JERSEY_SCHEMA;
  let initialParts = Array.isArray(safeSchema.customizableParts) && safeSchema.customizableParts.length > 0
    ? safeSchema.customizableParts.filter((p: any) => !p.id?.match(/^(path|rect|circle|polygon|polyline|g|ellipse|line)_\d+$/i))
    : [];

  if (initialParts.length === 0 && safeSchema.views && safeSchema.views.length > 0) {
    const allLayers = safeSchema.views.flatMap((v: any) => v.layers || []);
    initialParts = allLayers
      .filter((l: any) => {
        if (l.layerType === 'TEXT' || l.layerType === 'IMAGE' || l.isEditable === false) return false;
        const lid = l.layerName || l.label || l.elementId || l.id || "";
        return !lid.match(/^(path|rect|circle|polygon|polyline|g|ellipse|line)_\d+$/i);
      })
      .map((l: any) => ({
        id: l.elementId || l.id,
        label: l.layerName || l.label || l.elementId || l.id,
        defaultColor: l.defaultColorValue || l.defaultColor || '#FFFFFF',
      }));
  }

  if (initialParts.length === 0) {
    initialParts = SOCCER_JERSEY_SCHEMA.customizableParts;
  }

  const [parts, setParts] = useState<Array<{ id: string; label: string; defaultColor?: string }>>(() => initialParts);

  const handleLayersDetected = useCallback((detectedLayers: Array<{ id: string; label: string; defaultColor: string; layerType: string }>) => {
    if (!detectedLayers || detectedLayers.length === 0) return;
    const namedLayers = detectedLayers.filter((l) => !l.id.match(/^(path|rect|circle|polygon|polyline|g|ellipse|line)_\d+$/i));
    const effectiveLayers = namedLayers.length > 0 ? namedLayers : (initialParts.length > 0 ? [] : detectedLayers);
    if (effectiveLayers.length === 0) return;

    const mappedParts = effectiveLayers.map((l) => ({
      id: l.id,
      label: l.label,
      defaultColor: l.defaultColor,
    }));

    setParts((prevParts) => {
      if (
        prevParts.length === mappedParts.length &&
        prevParts.every((p, i) => p.id === mappedParts[i].id && p.label === mappedParts[i].label)
      ) {
        return prevParts;
      }
      return mappedParts;
    });

    setColors((prevColors) => {
      const next = { ...prevColors };
      let changed = false;
      effectiveLayers.forEach((l) => {
        if (!next[l.id]) {
          next[l.id] = l.defaultColor || "#FFFFFF";
          changed = true;
        }
      });
      return changed ? next : prevColors;
    });
  }, [initialParts]);

  const supportedTabs = Array.isArray(safeSchema.supportedTabs) && safeSchema.supportedTabs.length > 0
    ? safeSchema.supportedTabs
    : SOCCER_JERSEY_SCHEMA.supportedTabs;

  const [activeTab, setActiveTab] = useState<CustomizerTab>(() => supportedTabs[0] || "colors");

  const [colors, setColors] = useState<KitColors>(() => {
    const initialColors: Record<string, string> = { ...(safeSchema.defaultColors || {}) };
    initialParts.forEach((part) => {
      if (!initialColors[part.id]) {
        initialColors[part.id] = part.defaultColor || "#FFFFFF";
      }
    });
    if (Array.isArray(safeSchema.layerGroups)) {
      safeSchema.layerGroups.forEach((g: any) => {
        g.layers?.forEach((l: any) => {
          const lid = l.id || l.elementId;
          if (lid && !initialColors[lid]) {
            initialColors[lid] = l.defaultColor || l.defaultColorValue || "#FFFFFF";
          }
        });
      });
    }
    return initialColors;
  });

  const [pattern, setPattern] = useState<DesignPattern>(safeSchema.defaultPattern || SOCCER_JERSEY_SCHEMA.defaultPattern);

  const [lockedParts, setLockedParts] = useState<Record<string, boolean>>(() => {
    const initialLocks: Record<string, boolean> = {};
    initialParts.forEach((part) => { initialLocks[part.id] = false; });
    return initialLocks;
  });

  const [visibleParts, setVisibleParts] = useState<Record<string, boolean>>(() => {
    const initialVisibility: Record<string, boolean> = {};
    initialParts.forEach((part) => { initialVisibility[part.id] = true; });
    return initialVisibility;
  });

  const [activePartToEdit, setActivePartToEdit] = useState<string | null>(() => initialParts[0]?.id || null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const playerMgmt = usePlayerManagement();

  const changeColor = useCallback((part: string, color: string) => {
    if (lockedParts[part]) return;
    setColors((prev) => ({ ...prev, [part]: color }));
  }, [lockedParts]);

  const toggleLock = useCallback((part: string) => setLockedParts((prev) => ({ ...prev, [part]: !prev[part] })), []);
  const toggleVisibility = useCallback((part: string) => setVisibleParts((prev) => ({ ...prev, [part]: !prev[part] })), []);
  const selectPattern = useCallback((newPattern: DesignPattern) => setPattern(newPattern), []);
  const addUploadedFile = useCallback((fileUrl: string) => setUploadedFiles((prev) => [...prev, fileUrl]), []);

  const saveConfiguration = useCallback(async () => {
    setIsSaved(true);
    try {
      await saveProductConfiguration({
        productId: schema.id,
        versionName: playerMgmt.versionName,
        colors,
        pattern,
        playerText: playerMgmt.playerText,
        players: playerMgmt.players,
      });
    } catch (err) {
      console.error("Persist design config failure: ", err);
    }
    setTimeout(() => setIsSaved(false), 3000);
  }, [schema.id, playerMgmt.versionName, colors, pattern, playerMgmt.playerText, playerMgmt.players]);

  const tabs = supportedTabs.map((tabId) => {
    switch (tabId) {
      case "elements": return { id: "elements" as CustomizerTab, label: "Decals" };
      case "colors": return { id: "colors" as CustomizerTab, label: "Colors" };
      case "designs": return { id: "designs" as CustomizerTab, label: "Patterns" };
      case "text": return { id: "text" as CustomizerTab, label: "Text" };
      case "players": return { id: "players" as CustomizerTab, label: "Players" };
      default: return { id: tabId, label: tabId };
    }
  });

  const goToNextTab = useCallback(() => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
  }, [tabs, activeTab]);

  return {
    schema: safeSchema,
    parts,
    activeTab,
    setActiveTab,
    colors,
    changeColor,
    lockedParts,
    toggleLock,
    visibleParts,
    toggleVisibility,
    activePartToEdit,
    setActivePartToEdit,
    pattern,
    selectPattern,
    ...playerMgmt,
    uploadedFiles,
    addUploadedFile,
    isSaved,
    saveConfiguration,
    tabs,
    goToNextTab,
    handleLayersDetected,
  };
}

export type UseCustomizeReturn = ReturnType<typeof useCustomize>;
