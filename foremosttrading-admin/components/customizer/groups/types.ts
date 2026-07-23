export interface GroupLayer {
  id: string; // elementId (e.g. layer_1)
  svgLayerId?: string;
  displayLabel: string;
  displayOrder: number;
}

export interface AdminLayerGroup {
  id: string;
  name: string;
  isLocked: boolean;
  isVisible: boolean;
  displayOrder: number;
  layers: GroupLayer[];
}

export interface CustomizablePart {
  id: string;
  label: string;
  defaultColor?: string;
}
