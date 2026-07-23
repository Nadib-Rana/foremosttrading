import React from "react";
import { Lock, Unlock, Eye, EyeOff, Palette } from "lucide-react";
import { COLOR_SWATCHES } from "../constants";

interface ColorPartRowProps {
  part: { id: string; label: string };
  color: string;
  isExpanded: boolean;
  isLocked: boolean;
  isVisible: boolean;
  onToggleExpand: () => void;
  onToggleLock: () => void;
  onToggleVisibility: () => void;
  onChangeColor: (color: string) => void;
}

export function ColorPartRow({
  part,
  color,
  isExpanded,
  isLocked,
  isVisible,
  onToggleExpand,
  onToggleLock,
  onToggleVisibility,
  onChangeColor,
}: ColorPartRowProps) {
  const partColor = color || "#FFFFFF";

  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-2xs transition-all">
      <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 select-none">
        <div onClick={onToggleExpand} className="flex-1 flex items-center gap-3">
          <div
            style={{ backgroundColor: partColor }}
            className="w-5 h-5 rounded-md border border-gray-200/80 shadow-3xs"
          />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
            {part.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLocked
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
            title={isLocked ? "Unlock edits" : "Lock edits"}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              !isVisible
                ? "bg-amber-50 border-amber-200 text-amber-500"
                : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
            title={isVisible ? "Hide part" : "Show part"}
          >
            {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && !isLocked && (
        <div className="px-3 pb-3 pt-1.5 border-t border-gray-50 bg-gray-50/50 flex flex-wrap gap-1.5 animate-in fade-in duration-200">
          {COLOR_SWATCHES.map((swatch) => {
            const isActive = partColor.toLowerCase() === swatch.hex.toLowerCase();
            return (
              <button
                key={swatch.name}
                onClick={() => onChangeColor(swatch.hex)}
                style={{ backgroundColor: swatch.hex }}
                className={`w-6 h-6 rounded-full border cursor-pointer transition-all hover:scale-110 shadow-xs ${
                  isActive
                    ? "border-[#EF892A] ring-2 ring-[#EF892A]/30 scale-105"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                title={swatch.name}
                aria-label={`Select ${swatch.name}`}
              />
            );
          })}

          <div className="relative w-6 h-6 rounded-full border border-gray-200 hover:border-gray-400 overflow-hidden cursor-pointer bg-white flex items-center justify-center shadow-xs transition-transform hover:scale-110">
            <input
              type="color"
              value={partColor}
              onChange={(e) => onChangeColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Custom color picker"
            />
            <Palette className="w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}
