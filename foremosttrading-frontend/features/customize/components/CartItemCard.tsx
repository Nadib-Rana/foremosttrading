"use client";

import { Trash2 } from "lucide-react";
import { KitPreview } from "./KitPreview";
import { KitColors, DesignPattern, PlayerText } from "../types";

interface CartItemCardProps {
  colors: KitColors;
  pattern: DesignPattern;
  playerText: PlayerText;
  visibleParts: Record<keyof KitColors, boolean>;
  frontClosure: string;
  bodyMaterial: string;
  sleevesMaterial: string;
  quantity: number;
  pricePerKit: number;
}

export function CartItemCard({
  colors,
  pattern,
  playerText,
  visibleParts,
  frontClosure,
  bodyMaterial,
  sleevesMaterial,
  quantity,
  pricePerKit,
}: CartItemCardProps) {
  // Formatting currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-gray-50 border border-gray-150/70 rounded-2xl p-4 flex gap-4 mt-6 relative shadow-3xs">
      {/* Trash Action Button */}
      <button
        className="absolute top-3 right-3 p-1.5 border border-red-200 bg-white hover:bg-red-50 text-red-500 rounded-lg transition-all cursor-pointer shadow-3xs"
        title="Remove item"
        aria-label="Remove item"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Jersey Thumbnail Visualizer Grid */}
      <div className="w-24 h-24 bg-white border border-gray-100 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
        <KitPreview
          colors={colors}
          pattern={pattern}
          playerText={playerText}
          visibleParts={visibleParts}
          isThumbnail={true}
          className="w-full grid grid-cols-2 gap-0.5 bg-transparent border-0 shadow-none p-0 scale-105 pointer-events-none select-none [&_text]:text-[10px] [&_span]:hidden"
        />
      </div>

      {/* Details Section */}
      <div className="flex-1 flex flex-col min-w-0 pr-6">
        <h3 className="font-heading text-sm font-black text-gray-900 tracking-tight mb-2 truncate">
          Evolution Football Kit
        </h3>

        {/* Spec Attributes */}
        <div className="flex flex-col gap-0.5 text-[10px]">
          <div className="flex items-center gap-1 text-gray-500 font-bold truncate">
            <span className="text-[9px] font-black text-gray-600">Front Clossure:</span>
            <span className="text-[#EF892A] font-semibold">{frontClosure}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 font-bold truncate">
            <span className="text-[9px] font-black text-gray-600">Body Material:</span>
            <span className="text-[#EF892A] font-semibold">{bodyMaterial}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 font-bold truncate">
            <span className="text-[9px] font-black text-gray-600">Sleeves Material:</span>
            <span className="text-[#EF892A] font-semibold">{sleevesMaterial}</span>
          </div>
          <div className="flex items-start gap-1 mt-0.5">
            <span className="text-[9px] font-black text-gray-600 shrink-0">Sizes:</span>
            <span className="text-[#EF892A] font-semibold leading-normal break-words max-w-[180px]">
              M, L, XL, 2XL, M, S, M, S, XL, 2XL
            </span>
          </div>
        </div>

        {/* Quantity and Price */}
        <div className="text-[11px] font-black text-gray-900 mt-2">
          {quantity} × {formatCurrency(pricePerKit)}
        </div>
      </div>
    </div>
  );
}
