import { useState, useCallback } from "react";
import { PlayerText, TeamPlayer } from "../types";

export function usePlayerManagement() {
  const [playerText, setPlayerText] = useState<PlayerText>({
    name: "PLAYER",
    number: "09",
    fontFamily: "font-heading",
    fontSize: 24,
    textColor: "#FFFFFF",
  });

  const [players, setPlayers] = useState<TeamPlayer[]>([
    { id: "1", number: "09", name: "PLAYER", size: "M" }
  ]);
  const [activePlayerId, setActivePlayerId] = useState<string>("1");
  const [versionName, setVersionName] = useState<string>("Player version 1");

  const updatePlayerText = useCallback((updates: Partial<PlayerText>) => {
    setPlayerText((prev) => ({ ...prev, ...updates }));
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
  }, [activePlayerId]);

  const addPlayer = useCallback(() => {
    const nextNum = (players.length + 1).toString().padStart(2, "0");
    const newPlayer: TeamPlayer = { id: Date.now().toString(), number: nextNum, name: `PLAYER`, size: "M" };
    setPlayers((prev) => [...prev, newPlayer]);
    setActivePlayerId(newPlayer.id);
    setPlayerText((prev) => ({ ...prev, name: newPlayer.name, number: newPlayer.number }));
  }, [players.length]);

  const updatePlayer = useCallback((id: string, field: keyof TeamPlayer, value: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    if (id === activePlayerId) {
      setPlayerText((prev) => ({ ...prev, [field === "number" ? "number" : "name"]: value }));
    }
  }, [activePlayerId]);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter((p) => p.id !== id);
      if (id === activePlayerId) {
        const fallback = filtered[0];
        setActivePlayerId(fallback.id);
        setPlayerText((prevText) => ({ ...prevText, name: fallback.name || "PLAYER", number: fallback.number || "00" }));
      }
      return filtered;
    });
  }, [activePlayerId]);

  const selectActivePlayer = useCallback((id: string) => {
    setActivePlayerId(id);
    const target = players.find((p) => p.id === id);
    if (target) {
      setPlayerText((prev) => ({ ...prev, name: target.name || "PLAYER", number: target.number || "00" }));
    }
  }, [players]);

  return {
    playerText,
    setPlayerText,
    updatePlayerText,
    players,
    setPlayers,
    activePlayerId,
    versionName,
    setVersionName,
    addPlayer,
    updatePlayer,
    removePlayer,
    selectActivePlayer,
  };
}
