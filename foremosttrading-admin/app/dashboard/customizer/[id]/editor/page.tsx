"use client";

import { useState, use } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  Droplet, 
  Shapes, 
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BodyShape3D } from "@/components/customizer/BodyShape3D";

const tabs = [
  { id: "body", label: "Body Shape", icon: Palette },
  { id: "colors", label: "Colors", icon: Droplet },
  { id: "elements", label: "Elements", icon: Shapes },
  { id: "text", label: "Text", icon: Type },
];

export default function CustomizerEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState("body");
  const [selectedShape, setSelectedShape] = useState("Full Body");
  
  return (
    <div className="flex h-screen bg-[#f4f5f7] overflow-hidden -m-8">
      {/* Header (Absolute position to overlay if needed, or just flex-col in a wrapper) */}
      <div className="absolute top-4 left-8 z-10">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight">Evolution Football Kit</h1>
        <p className="font-semibold text-lg">$199 - $699</p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 w-full h-full p-8 pt-24 gap-6">
        
        {/* Left Pane: Preview Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="relative w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
             <div className="absolute inset-0 bg-gray-50/50 rounded-lg overflow-hidden">
                <BodyShape3D shapeName={selectedShape} interactive={true} />
             </div>
          </div>
        </div>

        {/* Right Pane: Controls */}
        <div className="w-[400px] flex flex-col gap-4">
          <Card className="flex-1 border-gray-100 shadow-sm flex flex-col overflow-hidden bg-white">
            <CardContent className="p-4 flex flex-col h-full gap-4">
              
              {/* Tabs */}
              <div className="grid grid-cols-4 gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex flex-col items-center justify-center py-3 rounded-lg border transition-all text-xs font-medium gap-1.5",
                        isActive 
                          ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      )}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === "body" && (
                  <div className="grid grid-cols-2 gap-3 pb-4">
                    {[
                      "Full Body", 
                      "Full Hand & Body", 
                      "Half Body (Full Hand)", 
                      "Half Body (Half Hand)", 
                      "Legs", 
                      "Others"
                    ].map((shapeName, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedShape(shapeName)}
                        className={cn(
                          "relative aspect-square rounded-lg border-2 cursor-pointer overflow-hidden transition-all shadow-sm flex items-center justify-center group",
                          selectedShape === shapeName 
                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20" 
                            : "border-gray-100 bg-gray-50 hover:border-blue-400"
                        )}
                      >
                        <div className="absolute inset-0 pb-6 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                          <BodyShape3D shapeName={shapeName} interactive={false} />
                        </div>
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                        <span className="absolute bottom-2 inset-x-2 text-center text-[11px] font-bold text-gray-800 bg-white/90 px-1.5 py-1 rounded shadow-sm">
                          {shapeName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab !== "body" && (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings coming soon</p>
                  </div>
                )}
              </div>
              
              {/* Bottom Actions */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-100 rounded-lg px-4 flex items-center justify-between text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors">
                    Player version 1
                  </div>
                  <Button className="bg-black hover:bg-gray-900 text-white rounded-lg px-6 shadow-md font-semibold">
                    Save Design
                  </Button>
                </div>
                <Button className="w-full bg-[#f48a27] hover:bg-[#e07b20] text-white rounded-lg h-12 text-md font-bold shadow-md">
                  Select Materials
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
