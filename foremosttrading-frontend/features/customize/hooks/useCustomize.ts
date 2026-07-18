"use client";

import { useState } from "react";
import { CustomizerTab, KitColors, DesignPattern, PlayerText, TeamPlayer, ProductSchema } from "../types";
import { SOCCER_JERSEY_SCHEMA } from "../schemas/soccerJerseySchema";
import { saveProductConfiguration } from "../api/customizeApi";

export function useCustomize(schema: ProductSchema = SOCCER_JERSEY_SCHEMA) {
  const [activeTab, setActiveTab] = useState<CustomizerTab>(() => {
    return schema.supportedTabs[0] || "colors";
  });

  // Initialize dynamic color map from schema customizable parts
  const [colors, setColors] = useState<KitColors>(() => {
    const initialColors: Record<string, string> = {};
    schema.customizableParts.forEach((part) => {
      initialColors[part.id] = part.defaultColor;
    });
    return initialColors;
  });

  const [pattern, setPattern] = useState<DesignPattern>(schema.defaultPattern);
  
  // Dynamic visible/locked states from schema customizable parts
  const [lockedParts, setLockedParts] = useState<Record<string, boolean>>(() => {
    const initialLocks: Record<string, boolean> = {};
    schema.customizableParts.forEach((part) => {
      initialLocks[part.id] = false;
    });
    return initialLocks;
  });

  const [visibleParts, setVisibleParts] = useState<Record<string, boolean>>(() => {
    const initialVisibility: Record<string, boolean> = {};
    schema.customizableParts.forEach((part) => {
      initialVisibility[part.id] = true;
    });
    return initialVisibility;
  });

  const [activePartToEdit, setActivePartToEdit] = useState<string | null>(() => {
    return schema.customizableParts[0]?.id || null;
  });

  const [playerText, setPlayerText] = useState<PlayerText>({
    name: "PLAYER",
    number: "09",
    fontFamily: "font-heading",
    fontSize: 24,
    textColor: "#FFFFFF",
  });

  // Roster players state
  const [players, setPlayers] = useState<TeamPlayer[]>([
    { id: "1", number: "09", name: "PLAYER", size: "M" }
  ]);
  const [activePlayerId, setActivePlayerId] = useState<string>("1");
  const [versionName, setVersionName] = useState<string>("Player version 1");

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const changeColor = (part: string, color: string) => {
    if (lockedParts[part]) return; // Do not edit if locked
    setColors((prev) => ({ ...prev, [part]: color }));
  };

  const toggleLock = (part: string) => {
    setLockedParts((prev) => ({ ...prev, [part]: !prev[part] }));
  };

  const toggleVisibility = (part: string) => {
    setVisibleParts((prev) => ({ ...prev, [part]: !prev[part] }));
  };

  const selectPattern = (newPattern: DesignPattern) => {
    setPattern(newPattern);
  };

  const updatePlayerText = (updates: Partial<PlayerText>) => {
    setPlayerText((prev) => ({ ...prev, ...updates }));
    
    // Also sync the active player row text
    if (updates.name !== undefined || updates.number !== undefined) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === activePlayerId
            ? {
                ...p,
                ...(updates.name !== undefined ? { name: updates.name } : {}),
                ...(updates.number !== undefined ? { number: updates.number } : {}),
              }
            : p
        )
      );
    }
  };

  const addUploadedFile = (fileUrl: string) => {
    setUploadedFiles((prev) => [...prev, fileUrl]);
  };

  const saveConfiguration = async () => {
    setIsSaved(true);
    try {
      await saveProductConfiguration({
        productId: schema.id,
        versionName,
        colors,
        pattern,
        playerText,
        players,
      });
    } catch (err) {
      console.error("Persist design config failure: ", err);
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const addPlayer = () => {
    const nextNum = (players.length + 1).toString().padStart(2, "0");
    const newPlayer: TeamPlayer = {
      id: Date.now().toString(),
      number: nextNum,
      name: `PLAYER`,
      size: "M"
    };
    setPlayers((prev) => [...prev, newPlayer]);
    setActivePlayerId(newPlayer.id);
    setPlayerText((prev) => ({
      ...prev,
      name: newPlayer.name,
      number: newPlayer.number,
    }));
  };

  const updatePlayer = (id: string, field: keyof TeamPlayer, value: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    
    if (id === activePlayerId) {
      setPlayerText((prev) => ({
        ...prev,
        [field === "number" ? "number" : "name"]: value
      }));
    }
  };

  const removePlayer = (id: string) => {
    if (players.length <= 1) return;
    setPlayers((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (id === activePlayerId) {
        const fallback = filtered[0];
        setActivePlayerId(fallback.id);
        setPlayerText((prevText) => ({
          ...prevText,
          name: fallback.name || "PLAYER",
          number: fallback.number || "00",
        }));
      }
      return filtered;
    });
  };

  const selectActivePlayer = (id: string) => {
    setActivePlayerId(id);
    const target = players.find((p) => p.id === id);
    if (target) {
      setPlayerText((prev) => ({
        ...prev,
        name: target.name || "PLAYER",
        number: target.number || "00",
      }));
    }
  };

  const tabs = schema.supportedTabs.map((tabId) => {
    switch (tabId) {
      case "elements":
        return { id: "elements" as CustomizerTab, label: "Decals" };
      case "colors":
        return { id: "colors" as CustomizerTab, label: "Colors" };
      case "designs":
        return { id: "designs" as CustomizerTab, label: "Patterns" };
      case "text":
        return { id: "text" as CustomizerTab, label: "Text" };
      case "players":
        return { id: "players" as CustomizerTab, label: "Players" };
      default:
        return { id: tabId, label: tabId };
    }
  });

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  return {
    schema,
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
    playerText,
    updatePlayerText,
    uploadedFiles,
    addUploadedFile,
    isSaved,
    saveConfiguration,
    tabs,
    goToNextTab,
    players,
    activePlayerId,
    versionName,
    setVersionName,
    addPlayer,
    updatePlayer,
    removePlayer,
    selectActivePlayer,
  };
}

export type UseCustomizeReturn = ReturnType<typeof useCustomize>;
