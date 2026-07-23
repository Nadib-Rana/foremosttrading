import React from "react";
import { PlayerText } from "../types";
import { FONT_FAMILIES, FONT_WEIGHTS } from "../constants";

interface FontSelectorProps {
  playerText: PlayerText;
  onUpdateText: (updates: Partial<PlayerText>) => void;
}

export function FontSelector({ playerText, onUpdateText }: FontSelectorProps) {
  return (
    <>
      {/* Font Family Selector (Dropdown) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
          Font Family
        </label>
        <select
          value={playerText.fontFamily || "Oswald"}
          onChange={(e) => onUpdateText({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.id} value={font.id} style={{ fontFamily: font.id }}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* Font Weight Selector (Boldness) */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
          Font Weight (Boldness)
        </label>
        <div className="grid grid-cols-5 gap-1">
          {FONT_WEIGHTS.map((weight) => {
            const isSelected = (playerText.fontWeight || "bold") === weight.id;
            return (
              <button
                key={weight.id}
                type="button"
                onClick={() => onUpdateText({ fontWeight: weight.id })}
                className={`py-1.5 px-1 border rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white shadow-2xs"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {weight.name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
