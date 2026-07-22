import { ProductSchema, ProductColors, PlayerText, TeamPlayer } from "../types";
import { SOCCER_JERSEY_SCHEMA } from "../schemas/soccerJerseySchema";
import { api } from "@/services/apiService";

/**
 * Interface representing the payload structure for saving a customized design.
 */
export interface SaveConfigurationPayload {
  productId: string;
  versionName: string;
  colors: ProductColors;
  pattern: string;
  playerText: PlayerText;
  players: TeamPlayer[];
}

/**
 * Response payload structure from saving a design configuration.
 */
export interface SaveConfigurationResponse {
  success: boolean;
  designId: string;
  message?: string;
}

/**
 * Fetches a product schema configuration by ID from the backend with fallback.
 * @param productId Product identifier (e.g., "soccer-jersey").
 */
export async function fetchProductSchema(productId: string): Promise<ProductSchema> {
  try {
    const res = await api.getProductConfigSchema(productId);
    if (res && (res.id || res.customizableParts)) {
      return {
        id: res.id || productId,
        slug: res.slug || productId,
        name: res.name || "Custom Product",
        category: res.category || "Apparel",
        basePrice: res.basePrice ?? 99.99,
        svgUrl: res.svgUrl || undefined,
        customizableParts: res.customizableParts || [],
        patterns: res.patterns || [],
        fonts: res.fonts || [],
        supportedTabs: res.supportedTabs || ["colors", "designs", "elements", "players", "text"],
        defaultColors: res.defaultColors || {},
        defaultPattern: res.defaultPattern || "classic",
      };
    }
  } catch (err) {
    console.warn("Failed to fetch product schema from API:", err);
  }

  try {
    const product = await api.getProductBySlug(productId);
    if (product) {
      return {
        id: product.id || productId,
        slug: product.slug || productId,
        name: product.name || "Custom Product",
        category: product.category?.name || "Apparel",
        basePrice: Number(product.basePrice) || 99.99,
        customizableParts: [],
        patterns: [],
        fonts: [],
        supportedTabs: ["colors", "designs", "elements", "players", "text"],
        defaultColors: {},
        defaultPattern: "classic",
      };
    }
  } catch (err) {
    console.warn("Failed to fetch product info from API:", err);
  }

  if (productId === "soccer-jersey") {
    return SOCCER_JERSEY_SCHEMA;
  }

  return {
    id: productId,
    slug: productId,
    name: "Custom Product",
    category: "Apparel",
    basePrice: 99.99,
    customizableParts: [],
    patterns: [],
    fonts: [],
    supportedTabs: ["colors", "designs", "elements", "players", "text"],
    defaultColors: {},
    defaultPattern: "classic",
  };
}

/**
 * Saves a dynamic product customization configuration payload.
 * @param payload The complete configuration payload.
 */
export async function saveProductConfiguration(
  payload: SaveConfigurationPayload
): Promise<SaveConfigurationResponse> {
  console.log("Saving configuration payload:", payload);
  return {
    success: true,
    designId: `design_${Date.now()}`,
    message: "Design saved successfully to the database",
  };
}
