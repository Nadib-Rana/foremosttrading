"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2.5 mt-6">
      <button
        onClick={onDecrement}
        className="w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 transition-colors shadow-2xs cursor-pointer"
        title="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-16 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center font-bold text-gray-800 text-sm shadow-2xs select-none">
        {quantity}
      </div>
      <button
        onClick={onIncrement}
        className="w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 transition-colors shadow-2xs cursor-pointer"
        title="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
