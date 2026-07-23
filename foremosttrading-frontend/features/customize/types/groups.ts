export interface CustomerLayerItem {
  id: string; // elementId (e.g. layer_1)
  displayLabel: string;
  displayOrder: number;
}

export interface CustomerLayerGroup {
  id: string;
  name: string;
  isLocked?: boolean;
  isVisible?: boolean;
  displayOrder: number;
  layers: CustomerLayerItem[];
}
