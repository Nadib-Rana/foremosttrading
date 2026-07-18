"use client";

import { useState, useRef } from "react";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";

export function PricingCalculator() {
  const [productType, setProductType] = useState<"Jerseys" | "Jackets" | "Hoodies">("Jerseys");
  const [quantity, setQuantity] = useState(50);
  const productContainerRef = useRef<HTMLDivElement>(null);

  // Core base prices
  const basePrices = {
    Jerseys: 80,
    Jackets: 180,
    Hoodies: 100,
  };

  const basePrice = basePrices[productType];

  // Discount percentage calculator
  const getDiscountPercent = (q: number) => {
    if (q >= 100) return 30;
    if (q >= 50) return 20;
    if (q >= 25) return 12;
    if (q >= 10) return 5;
    return 0;
  };

  const discountPercent = getDiscountPercent(quantity);
  const discountedUnitPrice = basePrice * (1 - discountPercent / 100);
  const total = discountedUnitPrice * quantity;
  const savings = (basePrice - discountedUnitPrice) * quantity;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleProductScroll = (direction: "left" | "right") => {
    if (productContainerRef.current) {
      const scrollAmount = 100;
      productContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col gap-6 select-none">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-50">
        <h3 className="font-heading text-lg font-black text-gray-900 uppercase">
          Bulk Pricing Estimator
        </h3>
      </div>

      {/* Product Select Buttons */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-700 block">Select Product</label>
        <div className="relative flex items-center gap-1.5 w-full">
          {/* Left scroll button */}
          <button
            type="button"
            onClick={() => handleProductScroll("left")}
            className="flex sm:hidden items-center justify-center w-8 h-8 rounded-lg bg-[#F4F5F7] hover:bg-gray-200 active:scale-95 transition-all cursor-pointer flex-shrink-0 border-0"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={productContainerRef}
            className="flex-1 overflow-x-auto sm:overflow-x-visible scrollbar-none scroll-smooth flex gap-2"
          >
            <div className="flex min-w-max sm:min-w-0 sm:grid sm:grid-cols-3 gap-2 w-full">
              {(["Jerseys", "Jackets", "Hoodies"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProductType(type)}
                  className={`py-3 px-4 min-w-[90px] sm:min-w-0 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/50 active:scale-98 flex-shrink-0 sm:flex-shrink ${
                    productType === type
                      ? "bg-[#F97316] text-white border-[#F97316] shadow-xs"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Right scroll button */}
          <button
            type="button"
            onClick={() => handleProductScroll("right")}
            className="flex sm:hidden items-center justify-center w-8 h-8 rounded-lg bg-[#F4F5F7] hover:bg-gray-200 active:scale-95 transition-all cursor-pointer flex-shrink-0 border-0"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Quantity Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <label className="text-[10px] font-bold text-gray-700">Estimated Quantity</label>
          <span className="text-sm font-black text-[#F97316]">{quantity} units</span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          step="5"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-full accent-[#F97316] h-1.5 bg-gray-100 rounded-lg cursor-pointer appearance-none"
        />
        <div className="flex justify-between text-[9px] text-gray-400 font-bold">
          <span>Min: 10</span>
          <span>Max: 500</span>
        </div>
      </div>

      {/* Tier Details Card */}
      <div className="bg-orange-50/50 border border-orange-100/50 rounded-xl p-3 flex gap-2.5 items-start text-xs text-orange-800 leading-normal">
        <Info className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] font-semibold">
          Current discount tier: <span className="font-bold text-[#F97316]">{discountPercent}% off</span>. Base price of {productType.toLowerCase()} is {formatCurrency(basePrice)}/unit.
        </p>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 gap-3.5 mt-2">
        <div className="bg-[#F9F9F9] border border-gray-50 rounded-xl p-3 text-center">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Unit Price</span>
          <p className="text-base font-black text-gray-900 mt-0.5">{formatCurrency(discountedUnitPrice)}</p>
        </div>
        <div className="bg-[#F9F9F9] border border-gray-50 rounded-xl p-3 text-center">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Savings</span>
          <p className="text-base font-black text-green-600 mt-0.5">{formatCurrency(savings)}</p>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-900 rounded-xl p-4.5 text-center shadow-xs">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Estimated Package Total</span>
        <p className="text-2xl font-black text-[#F97316] mt-0.5">{formatCurrency(total)}</p>
      </div>
    </div>
  );
}
