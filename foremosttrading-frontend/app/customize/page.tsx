"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { useCustomize } from "@/features/customize/hooks/useCustomize";
import { KitPreview } from "@/features/customize/components/KitPreview";
import { TabContainer } from "@/features/customize/components/TabContainer";
import { TabDesigns } from "@/features/customize/components/TabDesigns";
import { TabColors } from "@/features/customize/components/TabColors";
import { TabElements } from "@/features/customize/components/TabElements";
import { TabText } from "@/features/customize/components/TabText";
import { TabPlayers } from "@/features/customize/components/TabPlayers";
import { Accordions } from "@/features/customize/components/Accordions";
import { SizeGuide } from "@/features/customize/components/SizeGuide";
import { fetchProductSchema } from "@/features/customize/api/customizeApi";
import { ProductSchema } from "@/features/customize/types";
import { SOCCER_JERSEY_SCHEMA } from "@/features/customize/schemas/soccerJerseySchema";
import { Loader2 } from "lucide-react";

function CustomizePageContent({ initialProductId }: { initialProductId: string | null }) {
  const [schema, setSchema] = useState<ProductSchema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetId = initialProductId || "soccer-jersey";
    setLoading(true);
    fetchProductSchema(targetId)
      .then((s) => {
        setSchema(s);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [initialProductId]);

  if (loading || !schema) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-[#EF892A]" />
        <span className="ml-3 text-sm font-medium">Loading product customizer…</span>
      </div>
    );
  }

  return <CustomizeWorkspace key={schema.id} schema={schema} />;
}

function CustomizePageInner() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") || searchParams.get("productId");

  return <CustomizePageContent initialProductId={productId} />;
}

function CustomizeWorkspace({ schema }: { schema: ProductSchema }) {
  const custom = useCustomize(schema);
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const activeSvgUrl = schema.views && schema.views.length > 0
    ? schema.views[activeViewIndex]?.svgUrl || schema.svgUrl
    : schema.svgUrl;

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
    <main className="min-h-screen bg-[#F9F9F9] text-gray-900 flex flex-col">
      {/* Light Navbar */}
      <Navbar theme="light" />

      {/* Main Builder Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Title Block */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900">
            {schema.name}
          </h1>
          <p className="text-sm font-black text-[#EF892A] uppercase mt-1 tracking-wider">
            {schema.basePrice ? `$${schema.basePrice.toFixed(2)}` : "Customize Your Kit"}
          </p>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">

          {/* Left Side: Preview Card & Multi-View Switcher Bar */}
          <div className="lg:col-span-7 flex flex-col h-[350px] sm:h-[450px] lg:h-[650px] min-h-0 bg-white border border-gray-100 rounded-2xl relative overflow-hidden">
            <KitPreview
              colors={custom.colors}
              pattern={custom.pattern}
              playerText={custom.playerText}
              visibleParts={custom.visibleParts}
              productId={schema.id}
              svgUrl={activeSvgUrl}
              selectedLayerId={custom.activePartToEdit}
              onLayerSelect={(layerId) => {
                custom.setActiveTab("colors");
                custom.setActivePartToEdit(layerId);
              }}
            />

            {/* Multi-View Selector Bar (FRONT, BACK, LEFT, RIGHT) */}
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

          {/* Right Side: Tab Controls Panel */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between h-full lg:h-[650px] overflow-hidden">
            <TabContainer
              activeTab={custom.activeTab}
              setActiveTab={custom.setActiveTab}
              tabs={custom.tabs}
            />

            {/* Render Tab Views */}
            <div className="flex-1 flex flex-col min-h-0 bg-gray-50 rounded-2xl p-4 overflow-hidden">
              {custom.activeTab === "designs" && (
                <TabDesigns
                  currentPattern={custom.pattern}
                  onPatternSelect={custom.selectPattern}
                  onSave={custom.saveConfiguration}
                  onNext={custom.goToNextTab}
                  isSaved={custom.isSaved}
                  patterns={custom.schema.patterns}
                  versionName={custom.versionName}
                  onVersionNameChange={custom.setVersionName}
                />
              )}
              {custom.activeTab === "colors" && (
                <TabColors
                  colors={custom.colors}
                  onChangeColor={custom.changeColor}
                  lockedParts={custom.lockedParts}
                  toggleLock={custom.toggleLock}
                  visibleParts={custom.visibleParts}
                  toggleVisibility={custom.toggleVisibility}
                  activePartToEdit={custom.activePartToEdit}
                  setActivePartToEdit={custom.setActivePartToEdit}
                  onSave={custom.saveConfiguration}
                  onNext={custom.goToNextTab}
                  isSaved={custom.isSaved}
                  versionName={custom.versionName}
                  onVersionNameChange={custom.setVersionName}
                  parts={custom.schema.customizableParts}
                />
              )}
              {custom.activeTab === "elements" && (
                <TabElements
                  onSave={custom.saveConfiguration}
                  onNext={custom.goToNextTab}
                  isSaved={custom.isSaved}
                  uploadedFiles={custom.uploadedFiles}
                  onUploadFile={custom.addUploadedFile}
                  versionName={custom.versionName}
                  onVersionNameChange={custom.setVersionName}
                  imagePlaceholders={schema.imagePlaceholders}
                />
              )}
              {custom.activeTab === "text" && (
                <TabText
                  playerText={custom.playerText}
                  onUpdateText={custom.updatePlayerText}
                  onSave={custom.saveConfiguration}
                  onNext={handleNextFromText}
                  isSaved={custom.isSaved}
                  versionName={custom.versionName}
                  onVersionNameChange={custom.setVersionName}
                  texts={schema.texts}
                />
              )}
              {custom.activeTab === "players" && (
                <TabPlayers
                  players={custom.players}
                  activePlayerId={custom.activePlayerId}
                  onSelectActivePlayer={custom.selectActivePlayer}
                  onAddPlayer={custom.addPlayer}
                  onUpdatePlayer={custom.updatePlayer}
                  onRemovePlayer={custom.removePlayer}
                  versionName={custom.versionName}
                  onVersionNameChange={custom.setVersionName}
                  onSave={custom.saveConfiguration}
                  onNext={custom.goToNextTab}
                  isSaved={custom.isSaved}
                />
              )}
            </div>
          </div>

        </div>

        {/* Specs Accordions below the workspace row */}
        <div className="w-full mb-8">
          <Accordions />
        </div>

        {/* Size Chart Guide Section */}
        <SizeGuide />

      </div>

      {/* Dark Footer */}
      <Footer />
    </main>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <Loader2 className="h-8 w-8 animate-spin text-[#EF892A]" />
      </div>
    }>
      <CustomizePageInner />
    </Suspense>
  );
}

