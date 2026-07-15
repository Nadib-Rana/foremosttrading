"use client";

import { Layers, Palette, UploadCloud, Type, User } from "lucide-react";
import { CustomizerTab } from "../types";

interface TabContainerProps {
  activeTab: CustomizerTab;
  setActiveTab: (tab: CustomizerTab) => void;
  tabs: { id: CustomizerTab; label: string }[];
}

export function TabContainer({ activeTab, setActiveTab, tabs }: TabContainerProps) {
  const getIcon = (id: CustomizerTab) => {
    switch (id) {
      case "designs":
        return <Layers className="w-4 h-4" />;
      case "colors":
        return <Palette className="w-4 h-4" />;
      case "elements":
        return <UploadCloud className="w-4 h-4" />;
      case "text":
        return <Type className="w-4 h-4" />;
      case "players":
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex border-b border-gray-100 pb-4 mb-6 overflow-x-auto gap-2 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[70px] py-2 px-3 rounded-lg flex flex-col items-center gap-1 transition-all select-none cursor-pointer ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {getIcon(tab.id)}
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
