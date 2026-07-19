"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F4F5F7] text-gray-900 select-none">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
        {/* Animated Brand Logo Glow Wrapper */}
        <div className="relative flex items-center justify-center">
          {/* Subtle pulsating outer glow */}
          <div className="absolute w-20 h-20 rounded-full bg-[#EF892A] opacity-20 blur-xl animate-pulse" />
          
          {/* Main loader ring */}
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-[#EF892A] animate-spin" />
        </div>

        {/* Brand Text */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="font-heading text-lg font-black tracking-[0.25em] text-gray-900 uppercase italic">
            FOREMOST<span className="text-[#EF892A]">TRADING</span>
          </span>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
