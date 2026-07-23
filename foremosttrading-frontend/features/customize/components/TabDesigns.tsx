"use client";

import { DesignPattern } from "../types";
import { CustomizerTabFooter } from "./CustomizerTabFooter";

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
          {(Array.isArray(patterns) ? patterns : []).map((design, index) => {
            const isSelected = currentPattern === design.id;
            const rawImg = design.image || "";
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            let imgSrc = "https://images.unsplash.com/photo-1580087443864-44bfa286377e?w=500";
            if (rawImg.startsWith("http://") || rawImg.startsWith("https://") || rawImg.startsWith("data:")) {
              imgSrc = rawImg;
            } else if (rawImg.trim().length > 0) {
              const cleanPath = rawImg.startsWith("/") ? rawImg : `/${rawImg}`;
              imgSrc = `${apiBase}${cleanPath}`;
            }

            return (
              <div
                key={design.id || index}
                onClick={() => onPatternSelect(design.id)}
                className={`group flex flex-col p-1.5 bg-white border rounded-xl cursor-pointer hover:border-blue-500 transition-all select-none ${isSelected ? "border-blue-600 ring-2 ring-blue-500/20" : "border-gray-200"
                  }`}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-1.5 flex items-center justify-center">
                  <img
                    src={imgSrc}
                    alt={design.label || "Pattern"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
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
