import React from "react";
import { SoccerJerseyRenderer } from "./SoccerJerseyRenderer";
import { ProductColors, PlayerText } from "../types";

export interface ProductRendererProps {
  colors: ProductColors;
  pattern: string;
  playerText: PlayerText;
  visibleParts: Record<string, boolean>;
}

export type ProductRendererComponent = React.ComponentType<ProductRendererProps>;

export function getProductRenderer(productId: string): ProductRendererComponent {
  switch (productId) {
    case "soccer-jersey":
    default:
      return SoccerJerseyRenderer;
  }
}

export * from "./SoccerJerseyRenderer";
