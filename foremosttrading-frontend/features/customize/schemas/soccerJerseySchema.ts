import { ProductSchema } from "../types";
import { DESIGN_PATTERNS } from "../constants";

export const SOCCER_JERSEY_SCHEMA: ProductSchema = {
  id: "soccer-jersey",
  name: "Evolution Football Kit",
  category: "Football",
  customizableParts: [
    { id: "jerseyBody", label: "Jersey Body", defaultColor: "#D81920" },
    { id: "pantBody", label: "Pant Body", defaultColor: "#111111" },
    { id: "collar", label: "Collar", defaultColor: "#7A1C1C" },
    { id: "socks", label: "Socks", defaultColor: "#111111" },
    { id: "borders", label: "Borders & Accents", defaultColor: "#D81920" },
  ],
  patterns: DESIGN_PATTERNS,
  supportedTabs: ["colors", "designs", "elements", "players", "text"],
  defaultColors: {
    jerseyBody: "#D81920",
    pantBody: "#111111",
    collar: "#7A1C1C",
    socks: "#111111",
    borders: "#D81920",
  },
  defaultPattern: "classic",
};
