"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemCard } from "./CartItemCard";
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

        {/* Cart Item Card Sub-component */}
        <CartItemCard
          colors={colors}
          pattern={pattern}
          playerText={playerText}
          visibleParts={visibleParts}
          frontClosure={frontClosure}
          bodyMaterial={bodyMaterial}
          sleevesMaterial={sleevesMaterial}
          quantity={quantity}
          pricePerKit={pricePerKit}
        />

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
            className="flex-1 bg-[#EF892A] hover:bg-[#D97310] text-white font-bold py-5 rounded-xl text-[10px] tracking-wider text-center cursor-pointer shadow-sm transition-colors border-0"
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
}
