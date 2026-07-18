"use client";

import { Button } from "@/components/ui/button";
import { PlayerText } from "../types";
import { FONT_FAMILIES, COLOR_SWATCHES } from "../constants";

interface TabTextProps {
  playerText: PlayerText;
  onUpdateText: (updates: Partial<PlayerText>) => void;
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
}

export function TabText({
  playerText,
  onUpdateText,
  onSave,
  onNext,
  isSaved,
}: TabTextProps) {
  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1 flex flex-col gap-5">
        {/* Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
            Player Name
          </label>
          <input
            type="text"
            value={playerText.name}
            onChange={(e) => onUpdateText({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-semibold text-gray-800 focus:outline-none focus:border-blue-500 uppercase"
            placeholder="ENTER NAME"
            maxLength={12}
          />
        </div>

        {/* Number Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
            Player Number
          </label>
          <input
            type="text"
            value={playerText.number}
            onChange={(e) => onUpdateText({ number: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white font-semibold text-gray-800 focus:outline-none focus:border-blue-500"
            placeholder="00"
            maxLength={3}
          />
        </div>

        {/* Font Family Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
            Font Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FONT_FAMILIES.map((font) => {
              const isSelected = playerText.fontFamily === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => onUpdateText({ fontFamily: font.id })}
                  className={`py-2 px-3 border rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-600 shadow-2xs"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {font.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Color Swatches */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
            Text Color
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_SWATCHES.slice(0, 8).map((swatch) => {
              const isSelected = playerText.textColor.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.name}
                  onClick={() => onUpdateText({ textColor: swatch.hex })}
                  style={{ backgroundColor: swatch.hex }}
                  className={`w-6 h-6 rounded-full border cursor-pointer transition-all hover:scale-110 shadow-xs ${isSelected
                      ? "border-[#F97316] ring-2 ring-[#F97316]/30 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                    }`}
                  title={swatch.name}
                  aria-label={`Select ${swatch.name} text color`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 flex flex-col gap-3 mt-auto bg-gray-50 sticky bottom-0 z-20 flex-shrink-0">
        <div className="flex gap-3 items-stretch">
          <div className="flex-1 h-11 flex items-center px-4 bg-[#E2E8F0] rounded-lg text-xs font-bold text-gray-700 select-none">
            {isSaved ? "Saved Successfully!" : "Player version 1"}
          </div>
          <Button
            onClick={onSave}
            className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase h-11 px-5 rounded-lg border-0 cursor-pointer flex-shrink-0"
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
