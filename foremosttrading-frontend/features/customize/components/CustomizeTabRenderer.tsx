import React from "react";
import { TabDesigns } from "./TabDesigns";
import { TabColors } from "./TabColors";
import { TabElements } from "./TabElements";
import { TabText } from "./TabText";
import { TabPlayers } from "./TabPlayers";
import { ProductSchema } from "../types";
import { UseCustomizeReturn } from "../hooks/useCustomize";

interface CustomizeTabRendererProps {
  custom: UseCustomizeReturn;
  schema: ProductSchema;
  handleNextFromText: () => void;
}

export function CustomizeTabRenderer({
  custom,
  schema,
  handleNextFromText,
}: CustomizeTabRendererProps) {
  return (
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
          parts={custom.parts || custom.schema.customizableParts || []}
          layerGroups={schema.layerGroups}
          selectedLayerIds={custom.activePartToEdit ? [custom.activePartToEdit] : []}
          onSelectGroup={(group) => {
            if (group.layers && group.layers.length > 0) {
              custom.setActivePartToEdit(group.layers[0].id || (group.layers[0] as any).elementId);
            }
          }}
          onSelectLayer={(layerId) => {
            custom.setActivePartToEdit(layerId);
          }}
          onGroupColorChange={(groupId, newColor) => {
            const group = schema.layerGroups?.find((g: any) => g.id === groupId);
            if (group && group.layers) {
              group.layers.forEach((l: any) => {
                const lid = l.id || l.elementId;
                if (lid) custom.changeColor(lid, newColor);
              });
            } else {
              custom.changeColor(groupId, newColor);
            }
          }}
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
  );
}
