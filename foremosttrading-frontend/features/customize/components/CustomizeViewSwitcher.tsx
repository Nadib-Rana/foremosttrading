import React from "react";
import { Eye } from "lucide-react";
import { ActiveView } from "../types";

interface CustomizeViewSwitcherProps {
  views: Array<{ id: ActiveView; label: string }>;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export function CustomizeViewSwitcher({
  views,
  activeView,
  setActiveView,
}: CustomizeViewSwitcherProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 p-1.5 rounded-full text-white shadow-xl">
      <div className="flex items-center gap-1 px-2 text-[11px] font-bold text-gray-300">
        <Eye className="w-3.5 h-3.5 text-orange-400" />
        <span>View:</span>
      </div>
      {views.map((v) => {
        const isActive = activeView === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? "bg-[#EF892A] text-white shadow-xs"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
