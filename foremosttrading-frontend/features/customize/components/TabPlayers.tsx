"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamPlayer } from "../types";
import { SizeGuideModal } from "./SizeGuide";
import { PlayerRosterRow } from "./PlayerRosterRow";
import { CustomizerTabFooter } from "./CustomizerTabFooter";

interface TabPlayersProps {
  players: TeamPlayer[];
  activePlayerId: string | null;
  onSelectActivePlayer: (id: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayer: (id: string, field: keyof TeamPlayer, value: string) => void;
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
  versionName: string;
  onVersionNameChange: (name: string) => void;
}

export function TabPlayers({
  players,
  activePlayerId,
  onSelectActivePlayer,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayer,
  onSave,
  onNext,
  isSaved,
  versionName,
  onVersionNameChange,
}: TabPlayersProps) {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Team Roster ({players.length})
          </span>
          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-[11px] font-bold text-[#EF892A] hover:underline cursor-pointer"
          >
            Size Guide
          </button>
        </div>

        {players.map((player) => (
          <PlayerRosterRow
            key={player.id}
            player={player}
            isActive={activePlayerId === player.id}
            canRemove={players.length > 1}
            onSelectActivePlayer={onSelectActivePlayer}
            onUpdatePlayer={onUpdatePlayer}
            onRemovePlayer={onRemovePlayer}
          />
        ))}

        <Button
          onClick={onAddPlayer}
          variant="outline"
          className="w-full py-3 border-dashed border-gray-300 hover:border-gray-400 text-gray-600 font-bold text-xs flex items-center justify-center gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4 text-gray-500" />
          Add Another Player
        </Button>
      </div>

      <CustomizerTabFooter
        versionName={versionName}
        onVersionNameChange={onVersionNameChange}
        onSave={onSave}
        onNext={onNext}
        isSaved={isSaved}
      />

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
