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
    <div className="flex flex-col h-full justify-between">
      {/* Design Presets Grid (3 columns matching the 3x3 grid in screenshot) */}
      <div className="grid grid-cols-3 gap-2.5 mb-6 max-h-[350px] overflow-y-auto pr-1">
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

      {/* Action Footer */}
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-3 mt-auto">
        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {isSaved ? "Saved Design Successfully!" : "Player version 1"}
          </span>
          <Button
            variant="outline"
            onClick={onSave}
            className="border-gray-200 hover:bg-gray-100 font-bold text-xs uppercase"
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
