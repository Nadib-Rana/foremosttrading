"use client";

import { useState } from "react";
import { JerseyPreview } from "@/components/customizer/JerseyPreview";
import { Layers, PaintBucket, Type, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tab = "designs" | "colors" | "elements" | "text";

export function Configurator() {
  const [activeTab, setActiveTab] = useState<Tab>("colors");

  // State for jersey colors
  const [colors, setColors] = useState({
    body: "#FFFFFF",
    sleeves: "#111111",
    collar: "#FF0000",
    borders: "#FF0000",
  });

  const handleColorChange = (part: keyof typeof colors, color: string) => {
    setColors({ ...colors, [part]: color });
  };

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-black">
          EVOLUTION FOOTBALL KIT
        </h1>
        <p className="text-black font-semibold mt-1">$199 - $699</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Preview Panel */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[600px] flex items-center justify-center relative">
          <JerseyPreview colors={colors} />
        </div>

        {/* Right Side: Controls Panel */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b pb-4">
            <button
              onClick={() => setActiveTab("designs")}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "designs"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Layers className="w-5 h-5" />
              <span className="text-xs font-semibold">Designs</span>
            </button>
            <button
              onClick={() => setActiveTab("colors")}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "colors"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <PaintBucket className="w-5 h-5" />
              <span className="text-xs font-semibold">Colors</span>
            </button>
            <button
              onClick={() => setActiveTab("elements")}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "elements"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <UploadCloud className="w-5 h-5" />
              <span className="text-xs font-semibold">Elements</span>
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                activeTab === "text"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Type className="w-5 h-5" />
              <span className="text-xs font-semibold">Text</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto mb-6">
            {activeTab === "colors" && (
              <div className="flex flex-col gap-4">
                {Object.keys(colors).map((part) => (
                  <div
                    key={part}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={colors[part as keyof typeof colors]}
                        onChange={(e) =>
                          handleColorChange(part as keyof typeof colors, e.target.value)
                        }
                        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="font-semibold capitalize text-sm">
                        {part} Color
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab !== "colors" && (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                This tab content is under construction.
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t flex flex-col gap-3">
            <div className="flex justify-between items-center bg-gray-100 rounded-lg p-3">
              <span className="text-sm font-semibold text-gray-600">Player version 1</span>
              <Button variant="default" className="bg-[#111] hover:bg-black text-white">
                Save Design
              </Button>
            </div>
            <Button className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-6 text-lg font-bold uppercase">
              Select Materials
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
