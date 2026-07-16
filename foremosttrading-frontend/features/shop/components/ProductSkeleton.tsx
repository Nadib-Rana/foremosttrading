"use client";

import React from "react";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-3xl p-4 shadow-3xs animate-pulse select-none">
      {/* Product Image placeholder */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-2xl mb-4" />

      {/* Text Lines */}
      <div className="flex flex-col gap-2">
        {/* Category */}
        <div className="w-16 h-3 bg-gray-100 rounded-md" />
        
        {/* Title */}
        <div className="w-3/4 h-5 bg-gray-100 rounded-md mt-1" />
        
        {/* Price & Badge */}
        <div className="flex justify-between items-center mt-3">
          <div className="w-12 h-5 bg-gray-100 rounded-md" />
          <div className="w-20 h-7 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
