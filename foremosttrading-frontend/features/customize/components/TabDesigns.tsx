"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DesignPattern } from "../types";
import { DESIGN_PATTERNS } from "../constants";

interface TabDesignsProps {
  currentPattern: DesignPattern;
  onPatternSelect: (pattern: DesignPattern) => void;
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
  patterns: { id: string; label: string; image: string }[];
  versionName: string;
  onVersionNameChange: (name: string) => void;
}

export function TabDesigns({
  currentPattern,
  onPatternSelect,
  onSave,
  onNext,
  isSaved,
  patterns,
  versionName,
  onVersionNameChange,
}: TabDesignsProps) {
  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      {/* Design Presets Grid (3 columns matching the 3x3 grid in screenshot) */}
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1">
        <div className="grid grid-cols-3 gap-2.5">
          {patterns.map((design, index) => {
            const isSelected = currentPattern === design.id; // Correct selection binding
            return (
              <div
                key={index}
                onClick={() => onPatternSelect(design.id)}
                className={`group flex flex-col p-1.5 bg-white border rounded-xl cursor-pointer hover:border-blue-500 transition-all select-none ${isSelected ? "border-blue-600 ring-2 ring-blue-500/20" : "border-gray-200"
                  }`}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-1.5">
                  <Image
                    src={design.image}
                    alt={design.label}
                    fill
                    sizes="100px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <span className="text-[8px] font-black text-gray-800 text-center uppercase tracking-wider line-clamp-1">
                  {design.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-0 z-20 mt-auto bg-gray-50 pt-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={versionName}
            onChange={(e) => onVersionNameChange(e.target.value)}
            placeholder="Version Name"
            className="
        min-w-0
        flex-1
        h-11
        sm:h-12
        w-full
        rounded-lg
        border-0
        bg-[#E2E8F0]
        px-4
        text-sm
        sm:text-sm
        font-semibold
        text-gray-700
        placeholder:text-gray-500
        focus:outline-none
        focus:ring-2
        focus:ring-orange-400
      "
          />

          <Button
            onClick={onSave}
            className="
        h-11
        sm:h-12
        w-full
        sm:w-auto
        sm:min-w-[140px]
        px-5
        rounded-lg
        bg-black
        text-white
        text-sm
        font-bold
        uppercase
        hover:bg-neutral-800
        flex-shrink-0
      "
          >
            {isSaved ? "Saved!" : "Save Design"}
          </Button>
        </div>

        <Button
          onClick={onNext}
          className="
      mt-3
      h-11
      sm:h-12
      w-full
      rounded-lg
      bg-[#EF892A]
      text-white
      text-sm
      sm:text-base
      font-bold
      uppercase
      tracking-wide
      shadow-sm
      hover:bg-[#EA580C]
    "
        >
          Next
        </Button>
      </div>
    </div>
  );
}
