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
}

export function TabDesigns({
  currentPattern,
  onPatternSelect,
  onSave,
  onNext,
  isSaved,
}: TabDesignsProps) {
  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      {/* Design Presets Grid (3 columns matching the 3x3 grid in screenshot) */}
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1">
        <div className="grid grid-cols-3 gap-2.5">
          {DESIGN_PATTERNS.map((design, index) => {
            const isSelected = currentPattern === design.id && index === 0; // Simple highlight for demo
            return (
              <div
                key={index}
                onClick={() => onPatternSelect(design.id)}
                className={`group flex flex-col p-1.5 bg-white border rounded-xl cursor-pointer hover:border-blue-500 transition-all select-none ${
                  isSelected ? "border-blue-600 ring-2 ring-blue-500/20" : "border-gray-200"
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
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-auto">
        <div className="flex gap-2 items-center">
          <div className="flex-1 px-4 py-2.5 bg-[#E2E8F0] rounded-lg text-xs font-bold text-gray-700 select-none">
            {isSaved ? "Saved Successfully!" : "Player version 1"}
          </div>
          <Button
            onClick={onSave}
            className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase h-10 px-5 rounded-lg border-0 cursor-pointer flex-shrink-0"
          >
            {isSaved ? "Saved!" : "Save Design"}
          </Button>
        </div>
        <Button
          onClick={onNext}
          className="w-full bg-[#EF892A] hover:bg-[#EA580C] text-white py-3 text-sm font-bold uppercase tracking-wider cursor-pointer shadow-sm rounded-lg border-0"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
