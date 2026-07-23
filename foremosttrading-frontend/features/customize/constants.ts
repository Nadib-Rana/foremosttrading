import { KitColors, DesignPattern } from "./types";

export const COLOR_SWATCHES = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Light Gray", hex: "#E5E7EB" },
  { name: "Dark Slate", hex: "#1F2937" },
  { name: "Pure Black", hex: "#111111" },
  { name: "Arsenal Red", hex: "#D81920" },
  { name: "Maroon", hex: "#7A1C1C" },
  { name: "Royal Blue", hex: "#1D4ED8" },
  { name: "Navy Blue", hex: "#1E3A8A" },
  { name: "Teal Green", hex: "#0F766E" },
  { name: "Neon Yellow", hex: "#D9F99D" },
  { name: "Gold Yellow", hex: "#EAB308" },
  { name: "Sunset Orange", hex: "#EF892A" },
  { name: "Vibrant Purple", hex: "#6D28D9" },
];

export const DESIGN_PATTERNS: { id: DesignPattern; label: string; image: string }[] = [
  { id: "classic", label: "Classic Solid", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=150&auto=format&fit=crop" },
  { id: "striped", label: "Vertical Stripes", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=150&auto=format&fit=crop" },
  { id: "sash", label: "Diagonal Sash", image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=150&auto=format&fit=crop" },
  { id: "gradients", label: "Modern Gradient", image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=150&auto=format&fit=crop" },
  { id: "modern", label: "Split Geometric", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150&auto=format&fit=crop" },
  { id: "classic", label: "Fusion Splash", image: "https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=150&auto=format&fit=crop" },
  { id: "striped", label: "Evolution Tech", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=150&auto=format&fit=crop" },
  { id: "sash", label: "Vector Speed", image: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?q=80&w=150&auto=format&fit=crop" },
  { id: "gradients", label: "Pinnacle Edge", image: "https://images.unsplash.com/photo-1626245917062-4f53d49f6916?q=80&w=150&auto=format&fit=crop" },
];

export const FONT_FAMILIES = [
  { id: "Oswald", name: "Oswald" },
  { id: "Montserrat", name: "Montserrat" },
  { id: "Roboto", name: "Roboto" },
  { id: "Impact", name: "Impact" },
  { id: "Arial", name: "Arial" },
  { id: "Courier New", name: "Courier" },
  { id: "Georgia", name: "Georgia" },
  { id: "Trebuchet MS", name: "Trebuchet" },
];

export const FONT_WEIGHTS = [
  { id: "normal", name: "Normal" },
  { id: "500", name: "Medium" },
  { id: "600", name: "SemiBold" },
  { id: "bold", name: "Bold" },
  { id: "900", name: "Black" },
];

export const SIZE_CHART = [
  { size: "4XS", age: "(6Y)", chest: "34 cm", length: "51 cm", waist: "36 cm" },
  { size: "3XS", age: "(8Y)", chest: "38 cm", length: "54 cm", waist: "38 cm" },
  { size: "2XS", age: "(10Y)", chest: "41 cm", length: "58.5 cm", waist: "40 cm" },
  { size: "XS", age: "(12Y)", chest: "44 cm", length: "62.5 cm", waist: "42 cm" },
  { size: "S", age: "", chest: "47 cm", length: "66.5 cm", waist: "44 cm" },
  { size: "M", age: "", chest: "50 cm", length: "70 cm", waist: "46 cm" },
  { size: "L", age: "", chest: "53 cm", length: "72 cm", waist: "48 cm" },
  { size: "XL", age: "", chest: "55 cm", length: "74 cm", waist: "49 cm" },
  { size: "2XL", age: "", chest: "58 cm", length: "76.5 cm", waist: "50 cm" },
  { size: "3XL", age: "", chest: "60 cm", length: "78.5 cm", waist: "52 cm" },
];

export const DEFAULT_COLORS: KitColors = {
  jerseyBody: "#D81920",
  pantBody: "#111111",
  collar: "#7A1C1C",
  socks: "#111111",
  borders: "#D81920",
};
