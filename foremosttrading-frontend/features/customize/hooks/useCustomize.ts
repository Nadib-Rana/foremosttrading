"use client";

import { useState } from "react";
import { CustomizerTab, KitColors, DesignPattern, PlayerText, TeamPlayer } from "../types";
import { DEFAULT_COLORS } from "../constants";

export function useCustomize() {
  const [activeTab, setActiveTab] = useState<CustomizerTab>("colors");
  const [colors, setColors] = useState<KitColors>(DEFAULT_COLORS);
  const [pattern, setPattern] = useState<DesignPattern>("classic");
  
  // Track lock and visibility states for parts
  const [lockedParts, setLockedParts] = useState<Record<keyof KitColors, boolean>>({
    jerseyBody: false,
    pantBody: false,
    collar: false,
    socks: false,
    borders: false,
  });

  const [visibleParts, setVisibleParts] = useState<Record<keyof KitColors, boolean>>({
    jerseyBody: true,
    pantBody: true,
    collar: true,
    socks: true,
    borders: true,
  });

  const [activePartToEdit, setActivePartToEdit] = useState<keyof KitColors | null>("jerseyBody");

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

  const changeColor = (part: keyof KitColors, color: string) => {
    if (lockedParts[part]) return; // Do not edit if locked
    setColors((prev) => ({ ...prev, [part]: color }));
  };

  const toggleLock = (part: keyof KitColors) => {
    setLockedParts((prev) => ({ ...prev, [part]: !prev[part] }));
  };

  const toggleVisibility = (part: keyof KitColors) => {
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

  const saveConfiguration = () => {
    setIsSaved(true);
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

  const tabs: { id: CustomizerTab; label: string }[] = [
    { id: "elements", label: "Decals" },
    { id: "colors", label: "Colors" },
    { id: "designs", label: "Patterns" },
    { id: "text", label: "Text" },
    { id: "players", label: "Players" },
  ];

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  return {
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
