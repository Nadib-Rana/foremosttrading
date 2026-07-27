import React from "react";
import { KitColors } from "../types";
import { CustomerLayerGroup } from "../types/groups";
import { CustomerLayerGroupPanel } from "./CustomerLayerGroupPanel";
import { ColorPartRow } from "./ColorPartRow";
import { CustomizerTabFooter } from "./CustomizerTabFooter";

interface TabColorsProps {
  colors: KitColors;
  onChangeColor: (part: string, color: string) => void;
  lockedParts: Record<string, boolean>;
  toggleLock: (part: string) => void;
  visibleParts: Record<string, boolean>;
  toggleVisibility: (part: string) => void;
  activePartToEdit: string | null;
  setActivePartToEdit: (part: string | null) => void;
  onSave: () => void;
  onNext: () => void;
  isSaved: boolean;
  versionName: string;
  onVersionNameChange: (name: string) => void;
  parts: { id: string; label: string; defaultColor?: string }[];
  layerGroups?: CustomerLayerGroup[];
  selectedLayerIds?: string[];
  onSelectGroup?: (group: CustomerLayerGroup) => void;
  onSelectLayer?: (layerId: string) => void;
  onGroupColorChange?: (groupId: string, newColor: string) => void;
}

export function TabColors({
  colors,
  onChangeColor,
  lockedParts,
  toggleLock,
  visibleParts,
  toggleVisibility,
  activePartToEdit,
  setActivePartToEdit,
  onSave,
  onNext,
  isSaved,
  versionName,
  onVersionNameChange,
  parts,
  layerGroups = [],
  selectedLayerIds = [],
  onSelectGroup,
  onSelectLayer,
  onGroupColorChange,
}: TabColorsProps) {
  const safeParts = Array.isArray(parts) && parts.length > 0 ? parts : [];
  const safeGroups = Array.isArray(layerGroups) ? layerGroups : [];

  const hasAssignedLayersInGroups = safeGroups.some(
    (g) => Array.isArray(g.layers) && g.layers.length > 0
  );

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 justify-between gap-4 overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 flex flex-col gap-3 scrollbar-thin">
        {hasAssignedLayersInGroups && onSelectGroup && onSelectLayer ? (
          <CustomerLayerGroupPanel
            groups={safeGroups}
            allParts={safeParts}
            colorMap={colors}
            selectedLayerIds={selectedLayerIds}
            onSelectGroup={onSelectGroup}
            onSelectLayer={onSelectLayer}
            onGroupColorChange={onGroupColorChange}
            onChangeColor={onChangeColor}
            lockedParts={lockedParts}
            toggleLock={toggleLock}
            visibleParts={visibleParts}
            toggleVisibility={toggleVisibility}
            activePartToEdit={activePartToEdit}
            setActivePartToEdit={setActivePartToEdit}
          />
        ) : safeParts.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 font-semibold border border-dashed rounded-xl">
            Detecting customizable SVG layers…
          </div>
        ) : (
          safeParts.map((part) => {
            const isExpanded = activePartToEdit === part.id;
            const isLocked = Boolean(lockedParts[part.id]);
            const isVisible = visibleParts[part.id] !== false;

            return (
              <ColorPartRow
                key={part.id}
                part={part}
                color={colors[part.id] || part.defaultColor || "#FFFFFF"}
                isExpanded={isExpanded}
                isLocked={isLocked}
                isVisible={isVisible}
                onToggleExpand={() => !isLocked && setActivePartToEdit(isExpanded ? null : part.id)}
                onToggleLock={() => toggleLock(part.id)}
                onToggleVisibility={() => toggleVisibility(part.id)}
                onChangeColor={(color) => onChangeColor(part.id, color)}
              />
            );
          })
        )}
      </div>

      <CustomizerTabFooter
        versionName={versionName}
        onVersionNameChange={onVersionNameChange}
        onSave={onSave}
        onNext={onNext}
        isSaved={isSaved}
      />
    </div>
  );
}
