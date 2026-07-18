"use client";

import { Lock, Unlock, Eye, EyeOff, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KitColors } from "../types";
import { COLOR_SWATCHES } from "../constants";

interface TabColorsProps {
  colors: KitColors;
  onChangeColor: (part: keyof KitColors, color: string) => void;
  lockedParts: Record<keyof KitColors, boolean>;
  toggleLock: (part: keyof KitColors) => void;
  visibleParts: Record<keyof KitColors, boolean>;
  toggleVisibility: (part: keyof KitColors) => void;
  activePartToEdit: keyof KitColors | null;
  setActivePartToEdit: (part: keyof KitColors | null) => void;
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
  versionName: string;
  onVersionNameChange: (name: string) => void;
}

export function TabColors({
  colors,
  onChangeColor,
  lockedParts,
  toggleLock,
  visibleParts,
  toggleVisibility,
  activePartToEdit,
  setActivePartToEdit,
  onSave,
  onNext,
  isSaved,
  versionName,
  onVersionNameChange,
}: TabColorsProps) {
  const parts: { id: keyof KitColors; label: string }[] = [
    { id: "jerseyBody", label: "Jersey Body" },
    { id: "pantBody", label: "Pant Body" },
    { id: "collar", label: "Collar" },
    { id: "socks", label: "Socks" },
    { id: "borders", label: "Borders" },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1 flex flex-col gap-3">
        {parts.map((part) => {
          const isExpanded = activePartToEdit === part.id;
          const isLocked = lockedParts[part.id];
          const isVisible = visibleParts[part.id];

          return (
            <div
              key={part.id}
              className="flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden shadow-2xs transition-all"
            >
              {/* Row Header */}
              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 select-none">
                <div
                  onClick={() => !isLocked && setActivePartToEdit(isExpanded ? null : part.id)}
                  className="flex-1 flex items-center gap-3"
                >
                  <div
                    style={{ backgroundColor: colors[part.id] }}
                    className="w-5 h-5 rounded-md border border-gray-200/80 shadow-3xs"
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                    {part.label}
                  </span>
                </div>

                {/* Lock / Eye actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLock(part.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isLocked
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                    title={isLocked ? "Unlock edits" : "Lock edits"}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => toggleVisibility(part.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${!isVisible
                        ? "bg-amber-50 border-amber-200 text-amber-500"
                        : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                    title={isVisible ? "Hide part" : "Show part"}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expandable Swatch picker */}
              {isExpanded && !isLocked && (
                <div className="px-3 pb-3 pt-1.5 border-t border-gray-50 bg-gray-50/50 flex flex-wrap gap-1.5 animate-in fade-in duration-200">
                  {COLOR_SWATCHES.map((swatch) => {
                    const isActive = colors[part.id].toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => onChangeColor(part.id, swatch.hex)}
                        style={{ backgroundColor: swatch.hex }}
                        className={`w-6 h-6 rounded-full border cursor-pointer transition-all hover:scale-110 shadow-xs ${isActive
                            ? "border-[#F97316] ring-2 ring-[#F97316]/30 scale-105"
                            : "border-gray-200 hover:border-gray-400"
                          }`}
                        title={swatch.name}
                        aria-label={`Select ${swatch.name}`}
                      />
                    );
                  })}

                  {/* Custom color picker */}
                  <div className="relative w-6 h-6 rounded-full border border-gray-200 hover:border-gray-400 overflow-hidden cursor-pointer bg-white flex items-center justify-center shadow-xs transition-transform hover:scale-110">
                    <input
                      type="color"
                      value={colors[part.id]}
                      onChange={(e) => onChangeColor(part.id, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      title="Custom color picker"
                    />
                    <Palette className="w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="pt-4 flex flex-col gap-3 mt-auto bg-gray-50 sticky bottom-0 z-20 flex-shrink-0">
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
