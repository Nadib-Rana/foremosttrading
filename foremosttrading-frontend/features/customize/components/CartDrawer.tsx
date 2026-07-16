"use client";

import { Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KitPreview } from "./KitPreview";
import { KitColors, DesignPattern, PlayerText } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  colors: KitColors;
  pattern: DesignPattern;
  playerText: PlayerText;
  visibleParts: Record<keyof KitColors, boolean>;
  frontClosure: string;
  bodyMaterial: string;
  sleevesMaterial: string;
  quantity: number;
}

export function CartDrawer({
  isOpen,
  onClose,
  colors,
  pattern,
  playerText,
  visibleParts,
  frontClosure,
  bodyMaterial,
  sleevesMaterial,
  quantity,
}: CartDrawerProps) {
  const pricePerKit = 250;
  const subtotal = quantity * pricePerKit;

  // Formatting currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer Container Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[410px] bg-white z-50 shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header with back arrow */}
        <div className="flex items-center justify-start pb-4">
          <button
            onClick={onClose}
            className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-all cursor-pointer shadow-3xs w-9 h-9 flex items-center justify-center"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item Card */}
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
                <span className="text-[#3b82f6] font-semibold">{frontClosure}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 font-bold truncate">
                <span className="text-[9px] font-black text-gray-600">Body Material:</span>
                <span className="text-[#3b82f6] font-semibold">{bodyMaterial}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 font-bold truncate">
                <span className="text-[9px] font-black text-gray-600">Sleeves Material:</span>
                <span className="text-[#3b82f6] font-semibold">{sleevesMaterial}</span>
              </div>
              <div className="flex items-start gap-1 mt-0.5">
                <span className="text-[9px] font-black text-gray-600 shrink-0">Sizes:</span>
                <span className="text-[#3b82f6] font-semibold leading-normal break-words max-w-[180px]">
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

        {/* Subtotal Box */}
        <div className="bg-gray-50 border border-gray-150/70 rounded-xl p-3.5 text-center mt-6 shadow-3xs">
          <span className="font-heading text-xs font-black text-gray-800 tracking-wider">
            Subtotal: {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Bottom Actions Footer */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
          <Button
            variant="default"
            onClick={onClose}
            className="flex-1 bg-black hover:bg-neutral-800 text-white font-bold py-5 rounded-xl text-[10px] tracking-wider text-center cursor-pointer shadow-sm transition-colors border-0"
          >
            Edit
          </Button>
          <Button
            variant="default"
            onClick={handleCheckout}
            className="flex-1 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-5 rounded-xl text-[10px] tracking-wider text-center cursor-pointer shadow-sm transition-colors border-0"
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
}
