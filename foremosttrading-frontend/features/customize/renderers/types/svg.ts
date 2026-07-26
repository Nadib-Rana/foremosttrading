import { ProductColors, PlayerText } from "../../types";

export interface SoccerJerseyRendererProps {
  colors: ProductColors;
  pattern: string;
  playerText: PlayerText;
  visibleParts: Record<string, boolean>;
}

export interface DynamicSvgRendererProps {
  svgUrl?: string;
  svgRaw?: string;
  colors: ProductColors;
  playerText: PlayerText;
  visibleParts: Record<string, boolean>;
  pattern?: string;
  selectedLayerId?: string | null;
  selectedLayerIds?: string[];
  onLayerSelect?: (elementId: string, isMultiSelect?: boolean, isRangeSelect?: boolean) => void;
  onLayersDetected?: (layers: Array<{ id: string; label: string; defaultColor: string; layerType: string }>) => void;
  onError?: () => void;
}

export interface HoveredBadgeState {
  label: string;
  x: number;
  y: number;
}
