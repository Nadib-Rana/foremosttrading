"use client";

import { useRef, useEffect } from "react";
import { Layers, Palette, UploadCloud, Type, User } from "lucide-react";
import { CustomizerTab } from "../types";

interface TabContainerProps {
  activeTab: CustomizerTab;
  setActiveTab: (tab: CustomizerTab) => void;
  tabs: { id: CustomizerTab; label: string }[];
}

export function TabContainer({ activeTab, setActiveTab, tabs }: TabContainerProps) {
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

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
    <div className="w-full bg-[#F4F5F7] rounded-xl p-1.5 mb-6 overflow-x-auto lg:overflow-x-visible scrollbar-none scroll-smooth scroll-px-4">
      <div className="flex min-w-max lg:min-w-0 lg:w-full gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex-shrink-0 lg:flex-shrink min-w-[70px] py-2 px-3 rounded-lg flex flex-col items-center gap-1 transition-all select-none cursor-pointer border-0 ${isActive
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-gray-500 hover:text-gray-800"
                }`}
            >
              {getIcon(tab.id)}
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
