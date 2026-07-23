import React from "react";
import { Trash2 } from "lucide-react";
import { TeamPlayer } from "../types";
import { SIZE_CHART } from "../constants";

interface PlayerRosterRowProps {
  player: TeamPlayer;
  isActive: boolean;
  canRemove: boolean;
  onSelectActivePlayer: (id: string) => void;
  onUpdatePlayer: (id: string, field: keyof TeamPlayer, value: string) => void;
  onRemovePlayer: (id: string) => void;
}

export function PlayerRosterRow({
  player,
  isActive,
  canRemove,
  onSelectActivePlayer,
  onUpdatePlayer,
  onRemovePlayer,
}: PlayerRosterRowProps) {
  return (
    <div
      onClick={() => onSelectActivePlayer(player.id)}
      className={`flex items-center gap-1 sm:gap-2 bg-white p-1 sm:p-2 border rounded-xl shadow-2xs transition-all cursor-pointer ${
        isActive
          ? "border-blue-500 ring-2 ring-blue-500/10"
          : "border-gray-150 hover:border-gray-300"
      }`}
    >
      <div
        className="relative flex items-center w-14 sm:w-18 border border-gray-200 rounded-lg bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="pl-1 sm:pl-2 text-gray-400 text-xs font-black select-none">#</span>
        <input
          type="text"
          value={player.number}
          onChange={(e) => onUpdatePlayer(player.id, "number", e.target.value.replace(/\D/g, "").slice(0, 3))}
          placeholder="00"
          className="w-full pl-1 pr-1 sm:pr-2 py-1.5 sm:py-2 text-xs font-bold text-gray-800 bg-transparent focus:outline-none"
        />
      </div>

      <input
        type="text"
        value={player.name}
        onChange={(e) => onUpdatePlayer(player.id, "name", e.target.value.toUpperCase())}
        onClick={(e) => e.stopPropagation()}
        placeholder="PLAYER NAME"
        className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 uppercase focus:outline-none focus:border-blue-500 bg-white"
      />

      <select
        value={player.size}
        onChange={(e) => onUpdatePlayer(player.id, "size", e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="w-15 sm:w-20 px-1 sm:px-2 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
      >
        {SIZE_CHART.map((s) => (
          <option key={s.size} value={s.size}>
            {s.size}
          </option>
        ))}
      </select>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemovePlayer(player.id);
        }}
        disabled={!canRemove}
        className="p-1.5 sm:p-2 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
        title="Remove Player"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
