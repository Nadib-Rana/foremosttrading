"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCustomize } from "@/features/customize/hooks/useCustomize";
import { KitPreview } from "@/features/customize/components/KitPreview";
import { TabContainer } from "@/features/customize/components/TabContainer";
import { CustomizeTabRenderer } from "@/features/customize/components/CustomizeTabRenderer";
import { Accordions } from "@/features/customize/components/Accordions";
import { SizeGuide } from "@/features/customize/components/SizeGuide";
import { ProductSchema } from "@/features/customize/types";

export function CustomizeWorkspace({ schema }: { schema: ProductSchema }) {
  const custom = useCustomize(schema);
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const activeSvgUrl = schema.views && schema.views.length > 0
    ? schema.views[activeViewIndex]?.svgUrl || schema.svgUrl
    : schema.svgUrl;

  const activeSvgRaw = schema.views && schema.views.length > 0
    ? schema.views[activeViewIndex]?.svgRaw || (schema as any).svgRaw
    : (schema as any).svgRaw;

  const handleNextFromText = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("foremost_customizer_colors", JSON.stringify(custom.colors));
      localStorage.setItem("foremost_customizer_pattern", custom.pattern);
      localStorage.setItem("foremost_customizer_playerText", JSON.stringify(custom.playerText));
      localStorage.setItem("foremost_customizer_visibleParts", JSON.stringify(custom.visibleParts));
      window.location.href = "/customize/materials";
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9] text-gray-900 flex flex-col" suppressHydrationWarning>
      <Navbar theme="light" />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10" suppressHydrationWarning>
        <div className="mb-8 text-center sm:text-left">
          <h1 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900">
            {schema.name}
          </h1>
          <p className="text-sm font-black text-[#EF892A] uppercase mt-1 tracking-wider">
            {schema.basePrice ? `$${Number(schema.basePrice).toFixed(2)}` : "Customize Your Kit"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          {/* Left Column: 3D Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col h-[350px] sm:h-[450px] lg:h-[650px] min-h-0 bg-white border border-gray-100 rounded-2xl relative overflow-hidden shadow-sm">
            <KitPreview
              colors={custom.colors}
              pattern={custom.pattern}
              playerText={custom.playerText}
              visibleParts={custom.visibleParts}
              productId={schema.id}
              svgUrl={activeSvgUrl}
              svgRaw={activeSvgRaw}
              selectedLayerId={custom.activePartToEdit}
              onLayerSelect={(layerId) => {
                custom.setActiveTab("colors");
                custom.setActivePartToEdit(layerId);
              }}
              onLayersDetected={custom.handleLayersDetected}
            />

            {schema.views && schema.views.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-gray-200 z-10">
                {schema.views.map((v, idx) => (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={() => setActiveViewIndex(idx)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      activeViewIndex === idx
                        ? "bg-primary text-white shadow-2xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Customizer Tab Control Panel */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between h-[550px] lg:h-[650px] min-h-0 overflow-hidden">
            <TabContainer
              activeTab={custom.activeTab}
              setActiveTab={custom.setActiveTab}
              tabs={custom.tabs}
            />

            <CustomizeTabRenderer
              custom={custom}
              schema={schema}
              handleNextFromText={handleNextFromText}
            />
          </div>
        </div>

        <div className="w-full mb-8">
          <Accordions />
        </div>

        <SizeGuide />
      </div>

      <Footer />
    </main>
  );
}
