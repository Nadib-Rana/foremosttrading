"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemCard } from "./CartItemCard";
import { KitColors, DesignPattern, PlayerText } from "../types";
import { SignatureModal } from "./SignatureModal";

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

import { api } from "@/services/apiService";

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
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);

  // Formatting currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleConfirmCheckout = async (): Promise<string> => {
    const product = await api.getProductBySlug("soccer-jersey");
    
    // Add item to cart
    await api.addToCart({
      productId: product.id,
      quantity,
      specifications: {
        colors,
        pattern,
        playerText,
        materials: {
          bodyMaterial,
          sleevesMaterial,
          frontClosure,
        },
        roster: [
          { name: playerText.name, number: playerText.number, size: "M" }
        ]
      }
    });

    // Get or create shipping address
    let addresses = [];
    try {
      addresses = await api.getAddresses();
    } catch (err) {}

    let addressId;
    if (addresses && addresses.length > 0) {
      addressId = addresses[0].id;
    } else {
      const newAddress = await api.createAddress({
        street: "221B Baker Street",
        city: "Marylebone",
        state: "London",
        postalCode: "NW1 6XE",
        country: "United Kingdom",
      });
      addressId = newAddress.id;
    }

    // Place order
    const order = await api.placeOrder({
      shippingAddressId: addressId,
      signatureUrl: `Signature of ${playerText.name}`,
    });

    // Pay order to advance status to print queue
    await api.payOrder(order.id);
    
    return order.orderNumber;
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("ft_auth_token");
    if (!token) {
      alert("You must be logged in to proceed to checkout!");
      window.location.href = "/login";
      return;
    }
    setIsSignatureOpen(true);
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

      <SignatureModal
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
        onSuccessClose={() => {
          setIsSignatureOpen(false);
          onClose();
        }}
        quantity={quantity}
        subtotal={subtotal}
        onConfirm={handleConfirmCheckout}
      />
    </>
  );
}
