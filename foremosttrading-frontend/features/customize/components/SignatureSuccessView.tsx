"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignatureSuccessViewProps {
  quantity: number;
  subtotal: number;
  orderNumber: string;
  formatCurrency: (val: number) => string;
  onFinish: () => void;
}

export function SignatureSuccessView({
  quantity,
  subtotal,
  orderNumber,
  formatCurrency,
  onFinish,
}: SignatureSuccessViewProps) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-16 h-16 rounded-full bg-green-55/10 border border-green-200 flex items-center justify-center text-green-600 mb-6 shadow-3xs">
        <CheckCircle className="w-8 h-8 animate-bounce" />
      </div>

      <h3 className="font-heading text-2xl font-black text-gray-900 uppercase tracking-tight">
        Order Placed Successfully!
      </h3>
      <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-4 max-w-sm">
        Thank you! Your order of <span className="font-bold text-gray-800">{quantity} kits</span> has been received. Your digital signature confirmation has been successfully captured and linked to the order specifications.
      </p>

      <div className="bg-gray-50/50 border border-gray-150 rounded-2xl p-4 w-full mt-6 text-left text-xs flex flex-col gap-2 shadow-3xs select-text">
        <div className="flex justify-between items-center pb-2 border-b border-gray-150">
          <span className="font-bold text-gray-500">Order ID:</span>
          <span className="font-bold text-gray-800 font-mono">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-500">Subtotal:</span>
          <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-500">Authorization State:</span>
          <span className="text-[10px] font-extrabold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200 uppercase">
            Confirmed
          </span>
        </div>
      </div>

      <Button
        variant="default"
        onClick={onFinish}
        className="w-full mt-8 bg-black hover:bg-neutral-800 text-white py-5 rounded-xl text-[10px] font-bold tracking-wider text-center cursor-pointer shadow-sm transition-colors border-0"
      >
        Return to Customizer
      </Button>
    </div>
  );
}
