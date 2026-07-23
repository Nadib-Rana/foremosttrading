"use client";

import { PlayerText } from "../types";
import { COLOR_SWATCHES } from "../constants";
import { FontSelector } from "./FontSelector";
import { CustomizerTabFooter } from "./CustomizerTabFooter";

interface TabTextProps {
  playerText: PlayerText;
  onUpdateText: (updates: Partial<PlayerText>) => void;
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
  versionName: string;
  onVersionNameChange: (name: string) => void;
  texts?: Array<{
    id: string;
    layerName: string;
    textValue?: string;
    placeholder?: string;
    maxChars?: number;
    fontFamily?: string;
  }>;
}

export function TabText({
  playerText,
  onUpdateText,
  onSave,
  onNext,
  isSaved,
  versionName,
  onVersionNameChange,
  texts = [],
}: TabTextProps) {
  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1 flex flex-col gap-5">
        {/* Dynamic Backend Text Objects */}
        {texts.length > 0 && (
          <div className="space-y-3 pb-3 border-b border-gray-200">
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">
              Backend Vector Text Fields ({texts.length})
            </span>
            {texts.map((txt) => (
              <div key={txt.id} className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-700">
                  {txt.layerName || txt.id}
                </label>
                <input
                  type="text"
                  value={playerText[txt.id] !== undefined ? playerText[txt.id] : (txt.textValue || "")}
                  onChange={(e) => onUpdateText({ [txt.id]: e.target.value })}
                  placeholder={txt.placeholder || "ENTER TEXT"}
                  maxLength={txt.maxChars || 25}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white font-semibold text-gray-800 focus:outline-none focus:border-blue-500 uppercase"
                />
              </div>
            ))}
          </div>
        )}
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

        <FontSelector playerText={playerText} onUpdateText={onUpdateText} />

        {/* Text Color Swatches */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
            Text Color
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_SWATCHES.slice(0, 8).map((swatch) => {
              const textColor = playerText.textColor || "#FFFFFF";
              const isSelected = textColor.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.name}
                  onClick={() => onUpdateText({ textColor: swatch.hex })}
                  style={{ backgroundColor: swatch.hex }}
                  className={`w-6 h-6 rounded-full border cursor-pointer transition-all hover:scale-110 shadow-xs ${isSelected
                    ? "border-[#EF892A] ring-2 ring-[#EF892A]/30 scale-105"
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

      <CustomizerTabFooter
        versionName={versionName}
        onVersionNameChange={onVersionNameChange}
        onSave={onSave}
        onNext={onNext}
        isSaved={isSaved}
      />
    </div>
  );
}
