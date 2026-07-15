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
    <div className="flex flex-col h-full justify-between">
      {/* Players List Container */}
      <div className="flex flex-col gap-3 overflow-y-auto mb-6 max-h-[350px] pr-1">
        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
          Roster (Click row to preview jersey)
        </label>
        
        {players.map((player) => {
          const isActive = player.id === activePlayerId;
          return (
            <div
              key={player.id}
              onClick={() => onSelectActivePlayer(player.id)}
              className={`flex items-center gap-2 bg-white p-2 border rounded-xl shadow-2xs transition-all cursor-pointer ${
                isActive
                  ? "border-blue-500 ring-2 ring-blue-500/10"
                  : "border-gray-150 hover:border-gray-300"
              }`}
            >
              {/* Number Input with Prefix */}
              <div
                className="relative flex items-center w-18 border border-gray-200 rounded-lg bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="pl-2 text-gray-400 text-xs font-black select-none">#</span>
                <input
                  type="text"
                  value={player.number}
                  onChange={(e) => onUpdatePlayer(player.id, "number", e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="00"
                  className="w-full pl-1 pr-2 py-2 text-xs font-bold text-gray-800 bg-transparent focus:outline-none"
                />
              </div>

              {/* Name Input */}
              <input
                type="text"
                value={player.name}
                onChange={(e) => onUpdatePlayer(player.id, "name", e.target.value.toUpperCase())}
                onClick={(e) => e.stopPropagation()}
                placeholder="PLAYER NAME"
                className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 uppercase focus:outline-none focus:border-blue-500 bg-white"
              />

              {/* Size Dropdown */}
              <select
                value={player.size}
                onChange={(e) => onUpdatePlayer(player.id, "size", e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
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
                className="p-2 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
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
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-auto">
        <div className="flex gap-2 items-center bg-gray-50 rounded-xl p-2 border border-gray-100">
          <input
            type="text"
            value={versionName}
            onChange={(e) => onVersionNameChange(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-semibold text-gray-800 focus:outline-none focus:border-blue-500"
            placeholder="Version Name"
          />
          <Button
            onClick={onSave}
            className="bg-black hover:bg-neutral-800 text-white font-bold text-[10px] uppercase h-8 px-4 rounded-lg cursor-pointer"
          >
            {isSaved ? "Saved!" : "Save Design"}
          </Button>
        </div>
        <Button
          onClick={onNext}
          className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-6 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm rounded-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
