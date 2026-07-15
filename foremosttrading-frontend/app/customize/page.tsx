"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { useCustomize } from "@/features/customize/hooks/useCustomize";
import { KitPreview } from "@/features/customize/components/KitPreview";
import { TabContainer } from "@/features/customize/components/TabContainer";
import { TabDesigns } from "@/features/customize/components/TabDesigns";
import { TabColors } from "@/features/customize/components/TabColors";
import { TabElements } from "@/features/customize/components/TabElements";
import { TabText } from "@/features/customize/components/TabText";
import { Accordions } from "@/features/customize/components/Accordions";
import { SizeGuide } from "@/features/customize/components/SizeGuide";

export default function CustomizePage() {
  const custom = useCustomize();

  return (
    <main className="min-h-screen bg-[#F9F9F9] text-gray-900 flex flex-col">
      {/* Light Navbar */}
      <Navbar theme="light" />

      {/* Main Builder Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title Block */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900">
            Evolution Football Kit
          </h1>
          <p className="text-sm font-black text-[#F97316] uppercase mt-1 tracking-wider">
            $199 - $699
          </p>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Preview & Specs Accordions */}
          <div className="lg:col-span-7 flex flex-col">
            <KitPreview
              colors={custom.colors}
              pattern={custom.pattern}
              playerText={custom.playerText}
              visibleParts={custom.visibleParts}
            />
            <Accordions />
          </div>

          {/* Right Side: Tab Controls Panel */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col min-h-[500px]">
            <TabContainer
              activeTab={custom.activeTab}
              setActiveTab={custom.setActiveTab}
              tabs={custom.tabs}
            />

            {/* Render Tab Views */}
            <div className="flex-1">
              {custom.activeTab === "designs" && (
                <TabDesigns
                  currentPattern={custom.pattern}
                  onPatternSelect={custom.selectPattern}
                  onSave={custom.saveConfiguration}
                  onNext={custom.goToNextTab}
                  isSaved={custom.isSaved}
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
                />
              )}
              {custom.activeTab === "elements" && (
                <TabElements
                  onSave={custom.saveConfiguration}
                  onNext={custom.goToNextTab}
                  isSaved={custom.isSaved}
                  uploadedFiles={custom.uploadedFiles}
                  onUploadFile={custom.addUploadedFile}
                />
              )}
              {custom.activeTab === "text" && (
                <TabText
                  playerText={custom.playerText}
                  onUpdateText={custom.updatePlayerText}
                  onSave={custom.saveConfiguration}
                  onNext={custom.goToNextTab}
                  isSaved={custom.isSaved}
                />
              )}
            </div>
          </div>

        </div>

        {/* Size Chart Guide Section */}
        <SizeGuide />

      </div>

      {/* Dark Footer */}
      <Footer />
    </main>
  );
}
