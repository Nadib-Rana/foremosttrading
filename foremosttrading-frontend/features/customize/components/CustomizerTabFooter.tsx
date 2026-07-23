import React from "react";
import { Button } from "@/components/ui/button";

interface CustomizerTabFooterProps {
  versionName: string;
  onVersionNameChange: (name: string) => void;
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
}

export function CustomizerTabFooter({
  versionName,
  onVersionNameChange,
  onSave,
  onNext,
  isSaved,
}: CustomizerTabFooterProps) {
  return (
    <div className="sticky bottom-0 z-20 mt-auto bg-gray-50 pt-4 flex-shrink-0">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={versionName}
          onChange={(e) => onVersionNameChange(e.target.value)}
          placeholder="Version Name"
          className="min-w-0 flex-1 h-11 sm:h-12 w-full rounded-lg border-0 bg-[#E2E8F0] px-4 text-sm font-semibold text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <Button
          onClick={onSave}
          className="h-11 sm:h-12 w-full sm:w-auto sm:min-w-[140px] px-5 rounded-lg bg-black text-white text-sm font-bold uppercase hover:bg-neutral-800 flex-shrink-0"
        >
          {isSaved ? "Saved!" : "Save Design"}
        </Button>
      </div>

      <Button
        onClick={onNext}
        className="mt-3 h-11 sm:h-12 w-full rounded-lg bg-[#EF892A] text-white text-sm sm:text-base font-bold uppercase tracking-wide shadow-sm hover:bg-[#D97310]"
      >
        Next
      </Button>
    </div>
  );
}
