export type CustomizerTab = "designs" | "colors" | "elements" | "text" | "players";

// Dynamic ProductColors mapping to make it product-agnostic
export type ProductColors = Record<string, string>;

// Backwards-compatible alias for existing kit color types
export type KitColors = ProductColors;

export type DesignPattern = string;

export interface KitDesign {
  pattern: DesignPattern;
  primaryColor: string;
  secondaryColor: string;
}

export interface PlayerText {
  name: string;
  number: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
}

export interface ElementDecal {
  id: string;
  type: "logo" | "sponsor" | "badge";
  url: string;
  x: number;
  y: number;
  scale: number;
}

export interface TeamPlayer {
  id: string;
  number: string;
  name: string;
  size: string;
}

// Product Schema Definition for Backend Integration
export interface ProductPartSchema {
  id: string;
  label: string;
  defaultColor: string;
}

export interface ProductPatternSchema {
  id: string;
  label: string;
  image: string;
}

export interface ProductSchema {
  id: string;
  slug?: string;
  name: string;
  category: string;
  /** Presigned MinIO URL for the product SVG — present only when product has an uploaded SVG */
  svgUrl?: string;
  /** Base price of the product for display */
  basePrice?: number;
  customizableParts: ProductPartSchema[];
  patterns: ProductPatternSchema[];
  supportedTabs: CustomizerTab[];
  defaultColors: ProductColors;
  defaultPattern: string;
}

