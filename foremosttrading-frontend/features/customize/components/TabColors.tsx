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
  parts: { id: string; label: string }[];
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
  return (
    <div className="flex flex-col h-full min-h-0 justify-between">
      <div className="flex-1 overflow-y-auto min-h-0 mb-4 pr-1 flex flex-col gap-3">
        {layerGroups && layerGroups.length > 0 && onSelectGroup && onSelectLayer && (
          <CustomerLayerGroupPanel
            groups={layerGroups}
            allParts={parts}
            colorMap={colors}
            selectedLayerIds={selectedLayerIds}
            onSelectGroup={onSelectGroup}
            onSelectLayer={onSelectLayer}
            onGroupColorChange={onGroupColorChange}
          />
        )}
        {parts.map((part) => {
          const isExpanded = activePartToEdit === part.id;
          const isLocked = lockedParts[part.id];
          const isVisible = visibleParts[part.id];

          return (
            <ColorPartRow
              key={part.id}
              part={part}
              color={colors[part.id]}
              isExpanded={isExpanded}
              isLocked={isLocked}
              isVisible={isVisible}
              onToggleExpand={() => !isLocked && setActivePartToEdit(isExpanded ? null : part.id)}
              onToggleLock={() => toggleLock(part.id)}
              onToggleVisibility={() => toggleVisibility(part.id)}
              onChangeColor={(color) => onChangeColor(part.id, color)}
            />
          );
        })}
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
