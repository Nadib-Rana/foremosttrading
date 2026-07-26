import React from "react";
import { Lock, Unlock, Eye, EyeOff, Palette, ChevronDown, ChevronUp } from "lucide-react";
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

function formatLabel(raw: string): string {
  if (!raw) return "Layer";
  // Replace underscores, hyphens, or camelCase with spaces and capitalize words
  const spaced = raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim();
  return spaced
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function parseValidCssColor(rawColor: string): string {
  if (!rawColor) return "#FFFFFF";
  const trimmed = rawColor.trim();
  if (trimmed.startsWith("url(")) return "#EF892A";
  if (trimmed.startsWith("#") || trimmed.startsWith("rgb") || trimmed.startsWith("hsl")) return trimmed;
  return "#FFFFFF";
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
  const displayLabel = formatLabel(part.label || part.id);
  const swatchBgColor = parseValidCssColor(partColor);
  const colorSubtitle = partColor.startsWith("url(") ? "Gradient Pattern" : partColor;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs transition-all hover:border-gray-300">
      <div
        onClick={onToggleExpand}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50/80 select-none gap-2"
      >
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <div
            style={{ backgroundColor: swatchBgColor }}
            className="w-6 h-6 rounded-md border border-gray-300 shadow-2xs shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black uppercase tracking-wider text-gray-900 truncate">
              {displayLabel}
            </span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-tight">
              {colorSubtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
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
            type="button"
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

          <div className="p-1 text-gray-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {isExpanded && !isLocked && (
        <div className="px-3 pb-3.5 pt-2 border-t border-gray-100 bg-gray-50/80 flex flex-wrap gap-2 animate-in fade-in duration-200">
          {COLOR_SWATCHES.map((swatch) => {
            const isActive = partColor.toLowerCase() === swatch.hex.toLowerCase();
            return (
              <button
                key={swatch.name}
                type="button"
                onClick={() => onChangeColor(swatch.hex)}
                style={{ backgroundColor: swatch.hex }}
                className={`w-7 h-7 rounded-full border cursor-pointer transition-all hover:scale-110 shadow-xs ${
                  isActive
                    ? "border-[#EF892A] ring-2 ring-[#EF892A]/40 scale-105"
                    : "border-gray-300 hover:border-gray-500"
                }`}
                title={swatch.name}
                aria-label={`Select ${swatch.name}`}
              />
            );
          })}

          <div className="relative w-7 h-7 rounded-full border border-gray-300 hover:border-gray-500 overflow-hidden cursor-pointer bg-white flex items-center justify-center shadow-xs transition-transform hover:scale-110">
            <input
              type="color"
              value={partColor}
              onChange={(e) => onChangeColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Custom color picker"
            />
            <Palette className="w-4 h-4 text-gray-600 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}
