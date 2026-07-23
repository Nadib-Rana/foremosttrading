import { useState } from "react";
import { TeamPlayer } from "../types";

const DEFAULT_PLAYERS: TeamPlayer[] = [
  { id: "1", name: "ALEX", number: "10", size: "L" },
];

export function useCustomizerRoster(initialRoster: TeamPlayer[] = DEFAULT_PLAYERS) {
  const [players, setPlayers] = useState<TeamPlayer[]>(initialRoster);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(initialRoster[0]?.id || "1");

  const addPlayer = () => {
    const newId = String(Date.now());
    const nextNum = String((players.length + 1) * 7);
    const newPlayer: TeamPlayer = { id: newId, name: "PLAYER", number: nextNum, size: "M" };
    setPlayers((prev) => [...prev, newPlayer]);
    setActivePlayerId(newId);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 1) return;
    setPlayers((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (activePlayerId === id && next.length > 0) {
        setActivePlayerId(next[0].id);
      }
      return next;
    });
  };

  const updatePlayer = (id: string, field: keyof TeamPlayer, value: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const activePlayer = players.find((p) => p.id === activePlayerId) || players[0];

  return {
    players,
    setPlayers,
    activePlayerId,
    setActivePlayerId,
    activePlayer,
    addPlayer,
    removePlayer,
    updatePlayer,
  };
}
