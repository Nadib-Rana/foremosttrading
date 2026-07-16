"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KitPreview } from "./KitPreview";
import { CartDrawer } from "./CartDrawer";
import { KitColors, DesignPattern, PlayerText } from "../types";
import { DEFAULT_COLORS } from "../constants";

interface SelectMaterialsProps {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export function SelectMaterials({ isCartOpen, setIsCartOpen }: SelectMaterialsProps) {
  // Loaded customization states
  const [colors, setColors] = useState<KitColors>(DEFAULT_COLORS);
  const [pattern, setPattern] = useState<DesignPattern>("classic");
  const [playerText, setPlayerText] = useState<PlayerText>({
    name: "PLAYER",
    number: "00",
    fontFamily: "font-heading",
    fontSize: 24,
    textColor: "#FFFFFF",
  });
  const [visibleParts, setVisibleParts] = useState<Record<keyof KitColors, boolean>>({
    jerseyBody: true,
    pantBody: true,
    collar: true,
    socks: true,
    borders: true,
  });

  // Dropdown states
  const [frontClosure, setFrontClosure] = useState("Button");
  const [bodyMaterial, setBodyMaterial] = useState("Wool");
  const [sleevesMaterial, setSleevesMaterial] = useState("Cow Hide Leather");

  // Quantity state
  const [quantity, setQuantity] = useState(10);

  // Load configuration from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedColors = localStorage.getItem("foremost_customizer_colors");
      const storedPattern = localStorage.getItem("foremost_customizer_pattern");
      const storedPlayerText = localStorage.getItem("foremost_customizer_playerText");
      const storedVisibleParts = localStorage.getItem("foremost_customizer_visibleParts");

      if (storedColors) setColors(JSON.parse(storedColors));
      if (storedPattern) setPattern(storedPattern as DesignPattern);
      if (storedPlayerText) setPlayerText(JSON.parse(storedPlayerText));
      if (storedVisibleParts) setVisibleParts(JSON.parse(storedVisibleParts));
    }
  }, []);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    setIsCartOpen(true);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Title block matching Figma heading style exactly */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900">
          SELECT METEARIALS
        </h1>
      </div>

      {/* 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side View: Dynamic 4-View Visualizer in White Card */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex items-center justify-center min-h-[500px]">
          <KitPreview
            colors={colors}
            pattern={pattern}
            playerText={playerText}
            visibleParts={visibleParts}
            className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent border-0 shadow-none p-0"
          />
        </div>

        {/* Right Side Options & Actions */}
        <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-4">
          <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-gray-900 mb-4">
            EVOLUTION FOOTBALL KIT
          </h2>

          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 max-w-md">
            Choose the perfect material for your custom letterman jacket. Select from premium wool, genuine leather, satin, cotton, fleece, and more to match your style, comfort, and durability. Every material is crafted for a high-quality finish and lasting performance.
          </p>

          <div className="text-xl font-black text-gray-900 mb-8 tracking-wider">
            $199 – $699
          </div>

          {/* Form Dropdowns */}
          <div className="flex flex-col gap-5">
            {/* Front Closure */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 block">
                Front Clossure
              </label>
              <div className="relative">
                <select
                  value={frontClosure}
                  onChange={(e) => setFrontClosure(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs appearance-none cursor-pointer"
                >
                  <option value="Button">Button</option>
                  <option value="Zipper">Zipper</option>
                  <option value="Snaps">Snaps</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Body Material */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 block">
                Body Material
              </label>
              <div className="relative">
                <select
                  value={bodyMaterial}
                  onChange={(e) => setBodyMaterial(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs appearance-none cursor-pointer"
                >
                  <option value="Wool">Wool</option>
                  <option value="Satin">Satin</option>
                  <option value="Leather">Leather</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Fleece">Fleece</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Sleeves Material */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 block">
                Sleeves Material
              </label>
              <div className="relative border-b border-gray-100 pb-6">
                <select
                  value={sleevesMaterial}
                  onChange={(e) => setSleevesMaterial(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs appearance-none cursor-pointer"
                >
                  <option value="Cow Hide Leather">Cow Hide Leather</option>
                  <option value="Satin">Satin</option>
                  <option value="Wool">Wool</option>
                  <option value="PU Leather">PU Leather</option>
                  <option value="Polyester">Polyester</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quantity Controls Selector */}
          <div className="flex items-center gap-2.5 mt-6">
            <button
              onClick={handleDecrement}
              className="w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 transition-colors shadow-2xs cursor-pointer"
              title="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="w-16 h-12 rounded-xl border border-gray-200 bg-white flex items-center justify-center font-bold text-gray-800 text-sm shadow-2xs select-none">
              {quantity}
            </div>
            <button
              onClick={handleIncrement}
              className="w-12 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 transition-colors shadow-2xs cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-6">
            <Button
              onClick={handleAddToCart}
              className="w-full md:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white py-6 px-8 rounded-xl font-bold tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2.5 cursor-pointer text-xs"
            >
              <ShoppingCart className="w-4 h-4" />
              Add To Cart
            </Button>
          </div>

        </div>
      </div>

      {/* Cart side drawer overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        colors={colors}
        pattern={pattern}
        playerText={playerText}
        visibleParts={visibleParts}
        frontClosure={frontClosure}
        bodyMaterial={bodyMaterial}
        sleevesMaterial={sleevesMaterial}
        quantity={quantity}
      />
    </div>
  );
}
