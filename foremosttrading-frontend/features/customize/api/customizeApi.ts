import { ProductSchema, ProductColors, PlayerText, TeamPlayer } from "../types";
import { SOCCER_JERSEY_SCHEMA } from "../schemas/soccerJerseySchema";

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
 * Simulates fetching a product schema configuration by ID from the backend.
 * @param productId Product identifier (e.g., "soccer-jersey").
 */
export async function fetchProductSchema(productId: string): Promise<ProductSchema> {
  // Simulate network request delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  if (productId === "soccer-jersey") {
    return SOCCER_JERSEY_SCHEMA;
  }
  
  throw new Error(`Product schema not found for ID: ${productId}`);
}

/**
 * Simulates saving a dynamic product customization configuration payload to the database.
 * @param payload The complete configuration payload.
 */
export async function saveProductConfiguration(
  payload: SaveConfigurationPayload
): Promise<SaveConfigurationResponse> {
  // Simulate network request delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  console.log("Mock API saving configuration payload:", payload);
  
  return {
    success: true,
    designId: `design_${Date.now()}`,
    message: "Design saved successfully to the database",
  };
}
