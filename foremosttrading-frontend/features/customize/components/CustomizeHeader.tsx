import React from "react";
import { ProductSchema, CustomizerTab } from "../types";

interface CustomizeHeaderProps {
  schema: ProductSchema;
  activeTab: CustomizerTab;
  setActiveTab: (tab: CustomizerTab) => void;
  tabs: Array<{ id: CustomizerTab; label: string }>;
}

export function CustomizeHeader({
  schema,
  activeTab,
  setActiveTab,
  tabs,
}: CustomizeHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-heading font-black tracking-wide text-gray-900 uppercase">
            {schema.name || "Custom Team Jersey"}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Starting at <span className="font-bold text-gray-900">${Number(schema.basePrice || 45).toFixed(2)}</span> / unit
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
