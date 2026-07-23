import React from "react";
import { Sparkles } from "lucide-react";

interface MockupToolbarProps {
  isRealisticMode: boolean;
  setIsRealisticMode: (v: boolean) => void;
  fabricTexture: "mesh" | "cotton" | "smooth";
  setFabricTexture: (v: "mesh" | "cotton" | "smooth") => void;
}

export function MockupToolbar({
  isRealisticMode,
  setIsRealisticMode,
  fabricTexture,
  setFabricTexture,
}: MockupToolbarProps) {
  return (
    <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/15 p-1.5 rounded-full text-white shadow-xl opacity-90 hover:opacity-100 transition-opacity">
      <button
        onClick={() => setIsRealisticMode(!isRealisticMode)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          isRealisticMode
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
            : "bg-white/10 text-gray-300 hover:text-white"
        }`}
        title="Toggle Photorealistic 3D Mockup View"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>{isRealisticMode ? "Realistic 3D" : "Flat Vector"}</span>
      </button>

      {isRealisticMode && (
        <div className="flex items-center gap-1 px-1 border-l border-white/20">
          <button
            onClick={() => setFabricTexture("mesh")}
            className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
              fabricTexture === "mesh" ? "bg-white/30 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Mesh
          </button>
          <button
            onClick={() => setFabricTexture("cotton")}
            className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
              fabricTexture === "cotton" ? "bg-white/30 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Cotton
          </button>
        </div>
      )}
    </div>
  );
}
