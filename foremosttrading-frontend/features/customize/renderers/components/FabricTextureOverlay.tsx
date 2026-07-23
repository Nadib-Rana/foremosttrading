import React from "react";

interface FabricTextureOverlayProps {
  isRealisticMode: boolean;
  fabricTexture: "mesh" | "cotton" | "smooth";
}

export function FabricTextureOverlay({ isRealisticMode, fabricTexture }: FabricTextureOverlayProps) {
  if (!isRealisticMode) return null;

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none rounded-xl mix-blend-multiply opacity-75 transition-opacity duration-300 bg-gradient-to-tr from-black/20 via-transparent to-white/10"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.25) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-repeat"
        style={{
          backgroundImage:
            fabricTexture === "mesh"
              ? `radial-gradient(circle, #000 1px, transparent 1px)`
              : `linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%)`,
          backgroundSize: fabricTexture === "mesh" ? "4px 4px" : "8px 8px",
        }}
      />
    </>
  );
}
