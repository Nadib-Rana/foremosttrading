"use client";

import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamPlayer } from "../types";
import { SIZE_CHART } from "../constants";

interface TabPlayersProps {
  players: TeamPlayer[];
  activePlayerId: string;
  onSelectActivePlayer: (id: string) => void;
  onAddPlayer: () => void;
  onUpdatePlayer: (id: string, field: keyof TeamPlayer, value: string) => void;
  onRemovePlayer: (id: string) => void;
  versionName: string;
  onVersionNameChange: (name: string) => void;
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
}

export function TabPlayers({
  players,
  activePlayerId,
  onSelectActivePlayer,
  onAddPlayer,
  onUpdatePlayer,
  onRemovePlayer,
  versionName,
  onVersionNameChange,
  onSave,
  onNext,
  isSaved,
}: TabPlayersProps) {
  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      {/* Players List Container */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-3">
        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
          Roster (Click row to preview jersey)
        </label>

        {players.map((player) => {
          const isActive = player.id === activePlayerId;
          return (
            <div
              key={player.id}
              onClick={() => onSelectActivePlayer(player.id)}
              className={`flex items-center gap-1 sm:gap-2 bg-white p-1 sm:p-2 border rounded-xl shadow-2xs transition-all cursor-pointer ${isActive
                  ? "border-blue-500 ring-2 ring-blue-500/10"
                  : "border-gray-150 hover:border-gray-300"
                }`}
            >
              {/* Number Input with Prefix */}
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

              {/* Name Input */}
              <input
                type="text"
                value={player.name}
                onChange={(e) => onUpdatePlayer(player.id, "name", e.target.value.toUpperCase())}
                onClick={(e) => e.stopPropagation()}
                placeholder="PLAYER NAME"
                className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 uppercase focus:outline-none focus:border-blue-500 bg-white"
              />

              {/* Size Dropdown */}
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

              {/* Remove Row Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePlayer(player.id);
                }}
                disabled={players.length <= 1}
                className="p-1.5 sm:p-2 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                title="Remove Player"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {/* Add Player Button */}
        <button
          onClick={onAddPlayer}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer mt-1"
        >
          <Plus className="w-4 h-4" />
          Add New Player
        </button>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-auto bg-white sticky bottom-0 z-20 flex-shrink-0">
        <div className="flex gap-3 items-stretch">
          <input
            type="text"
            value={versionName}
            onChange={(e) => onVersionNameChange(e.target.value)}
            className="flex-1 h-11 px-4 bg-[#E2E8F0] border-0 rounded-lg text-xs font-bold text-gray-700 focus:outline-none placeholder-gray-500"
            placeholder="Version Name"
          />
          <Button
            onClick={onSave}
            className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase h-11 px-3 sm:px-5 rounded-lg border-0 cursor-pointer flex-shrink-0"
          >
            {isSaved ? "Saved!" : "Save Design"}
          </Button>
        </div>
        <Button
          onClick={onNext}
          className="w-full bg-[#EF892A] hover:bg-[#EA580C] text-white h-11 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm rounded-lg border-0 flex items-center justify-center"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
