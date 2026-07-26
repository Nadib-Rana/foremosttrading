"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignatureSuccessView } from "./SignatureSuccessView";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessClose: () => void;
  quantity: number;
  subtotal: number;
  onConfirm: () => Promise<string>;
}

export function SignatureModal({
  isOpen,
  onClose,
  onSuccessClose,
  quantity,
  subtotal,
  onConfirm,
}: SignatureModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const formatCurrency = useCallback((val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  }, []);

  useEffect(() => {
    if (isOpen && !isSuccess) {
      setIsAgreed(false);
      setErrorMsg("");
    }
  }, [isOpen, isSuccess]);

  const handleSubmit = async () => {
    if (!isAgreed) return;
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const orderRef = await onConfirm();
      setOrderNumber(orderRef);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process custom checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onSuccessClose();
    window.location.href = "/account";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm select-none p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl transition-all duration-300">
        {!isSuccess && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {!isSuccess ? (
          <div className="flex flex-col">
            <h3 className="font-heading text-xl font-black text-gray-900 uppercase flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#EF892A]" />
              Confirm Your Custom Order
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
              To finalize your custom order of <span className="font-bold text-gray-800">{quantity} items</span> ({formatCurrency(subtotal)}), please review and authorize the design specifications.
            </p>

            <div className="mt-6 border border-gray-150 rounded-2xl p-4 bg-gray-50/50 flex flex-col gap-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Product</span>
                <span className="font-bold text-gray-800">Evolution Football Kit</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Quantity</span>
                <span className="font-bold text-gray-800">{quantity} kits</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200/60 pt-2.5">
                <span className="font-bold text-gray-600 uppercase tracking-wider text-[10px]">Total Price</span>
                <span className="font-black text-gray-950 text-sm">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2.5 px-1">
              <input
                type="checkbox"
                id="signature-agreement"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#EF892A] focus:ring-[#EF892A]/50 focus:outline-none cursor-pointer"
              />
              <label htmlFor="signature-agreement" className="text-[11px] text-gray-600 font-bold leading-relaxed cursor-pointer select-none">
                I authorize that all custom design choices, colors, quantities, and materials selected are accurate. I agree to place this order into production under the terms and conditions of custom apparel design.
              </label>
            </div>

            {errorMsg && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-[10px] font-bold text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <Button
                variant="destructive"
                disabled={isSubmitting}
                onClick={onClose}
                className="flex-1 py-5 rounded-xl text-[10px] font-bold tracking-wider text-center cursor-pointer shadow-3xs transition-colors border-0"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                disabled={!isAgreed || isSubmitting}
                onClick={handleSubmit}
                className="flex-1 bg-[#EF892A] hover:bg-[#D97310] text-white py-5 rounded-xl text-[10px] font-bold tracking-wider text-center cursor-pointer shadow-sm transition-colors border-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm Order
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <SignatureSuccessView
            quantity={quantity}
            subtotal={subtotal}
            orderNumber={orderNumber}
            formatCurrency={formatCurrency}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}
