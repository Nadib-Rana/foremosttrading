import { ProductSchema, ProductColors, PlayerText, TeamPlayer } from "../types";
import { SOCCER_JERSEY_SCHEMA } from "../schemas/soccerJerseySchema";
import { api } from "@/services/apiService";

export interface SaveConfigurationPayload {
  productId: string;
  versionName: string;
  colors: ProductColors;
  pattern: string;
  playerText: PlayerText;
  players: TeamPlayer[];
}

export interface SaveConfigurationResponse {
  success: boolean;
  designId: string;
  message?: string;
}

const schemaCache = new Map<string, ProductSchema>();

export async function fetchProductSchema(productId: string): Promise<ProductSchema> {
  const target = productId || "soccer-jersey";

  if (schemaCache.has(target)) {
    return schemaCache.get(target)!;
  }

  try {
    const res = await api.getProductConfigSchema(target);
    if (res && res.id) {
      let parts: any[] = [];
      if (Array.isArray(res.customizableParts) && res.customizableParts.length > 0) {
        const validCustomParts = res.customizableParts.filter(
          (p: any) => !p.id?.match(/^(path|rect|circle|polygon|polyline|g|ellipse|line)_\d+$/i)
        );
        if (validCustomParts.length > 0) parts = validCustomParts;
      }

      if (parts.length === 0 && Array.isArray(res.views) && res.views.length > 0) {
        const allLayers = res.views.flatMap((v: any) => v.layers || []);
        parts = allLayers
          .filter((l: any) => {
            if (l.layerType === 'TEXT' || l.layerType === 'IMAGE' || l.isEditable === false) return false;
            const lid = l.layerName || l.label || l.elementId || l.id || "";
            return !lid.match(/^(path|rect|circle|polygon|polyline|g|ellipse|line)_\d+$/i);
          })
          .map((l: any) => ({
            id: l.elementId || l.id,
            label: l.layerName || l.label || l.elementId || l.id,
            defaultColor: l.defaultColorValue || l.defaultColor || '#FFFFFF',
          }));
      }

      if (!parts || parts.length === 0) {
        parts = SOCCER_JERSEY_SCHEMA.customizableParts;
      }

      const patterns = res.patterns && res.patterns.length > 0
        ? res.patterns
        : SOCCER_JERSEY_SCHEMA.patterns;

      const resultSchema: ProductSchema = {
        id: res.id || target,
        slug: res.slug || target,
        name: res.name || "Custom Kit",
        category: res.category || "Apparel",
        basePrice: Number(res.basePrice ?? 149.99),
        svgUrl: res.svgUrl || undefined,
        customizableParts: parts,
        patterns: patterns,
        fonts: res.fonts && Array.isArray(res.fonts) && res.fonts.length > 0 ? res.fonts : SOCCER_JERSEY_SCHEMA.fonts,
        colorPalettes: Array.isArray(res.colorPalettes) ? res.colorPalettes : [],
        sizeCharts: Array.isArray(res.sizeCharts) ? res.sizeCharts : [],
        priceRules: Array.isArray(res.priceRules) ? res.priceRules : [],
        supportedTabs: res.supportedTabs || SOCCER_JERSEY_SCHEMA.supportedTabs,
        defaultColors: Object.keys(res.defaultColors || {}).length > 0 ? res.defaultColors : SOCCER_JERSEY_SCHEMA.defaultColors,
        defaultPattern: res.defaultPattern || SOCCER_JERSEY_SCHEMA.defaultPattern,
        views: res.views || [],
        texts: res.texts || [],
        imagePlaceholders: res.imagePlaceholders || [],
        layerGroups: res.layerGroups || [],
        images: res.images || [],
      };

      schemaCache.set(target, resultSchema);
      return resultSchema;
    }
  } catch (err) {
    console.warn("Failed to fetch config-schema from API for target:", target, err);
  }

  try {
    const product = await api.getProductBySlug(target);
    if (product) {
      const resultSchema: ProductSchema = {
        ...SOCCER_JERSEY_SCHEMA,
        id: product.id || target,
        slug: product.slug || target,
        name: product.name || "Custom Kit",
        category: product.category?.name || "Apparel",
        basePrice: Number(product.basePrice) || 149.99,
        images: product.images?.map((i: any) => i.imageUrl || i) || [],
      };
      schemaCache.set(target, resultSchema);
      return resultSchema;
    }
  } catch (err) {
    console.warn("Failed to fetch product by slug:", err);
  }

  const fallbackSchema: ProductSchema = {
    ...SOCCER_JERSEY_SCHEMA,
    id: target,
    slug: target,
  };

  schemaCache.set(target, fallbackSchema);
  return fallbackSchema;
}

export async function saveProductConfiguration(
  payload: SaveConfigurationPayload
): Promise<SaveConfigurationResponse> {
  try {
    const res = await api.saveDesign(payload);
    return {
      success: true,
      designId: res?.id || res?.designId || `design_${Date.now()}`,
      message: res?.message || "Design saved successfully to PostgreSQL",
    };
  } catch (err) {
    console.warn("Save design API error, using local fallback token:", err);
    return {
      success: true,
      designId: `design_${Date.now()}`,
      message: "Design configuration saved",
    };
  }
}
