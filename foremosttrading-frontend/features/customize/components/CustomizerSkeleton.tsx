"use client";

import React from "react";

export function CustomizerSkeleton() {
  return (
    <div className="w-full h-full min-h-[500px] flex flex-col md:flex-row gap-6 p-4 animate-pulse select-none">
      {/* Left / Center Canvas Preview Skeleton */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800 p-8 relative overflow-hidden min-h-[400px]">
        <div className="w-48 h-48 md:w-80 md:h-80 rounded-full bg-gray-800/60 flex items-center justify-center relative">
          <div className="w-32 h-32 md:w-56 md:h-56 rounded-2xl bg-gray-700/50" />
        </div>
        
        {/* Floating Toolbar Skeleton */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700">
          <div className="w-16 h-3 bg-gray-600/80 rounded-md" />
          <div className="w-12 h-3 bg-gray-600/80 rounded-md" />
        </div>

        {/* View Thumbnails Skeleton */}
        <div className="absolute bottom-4 flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-gray-800">
          <div className="w-10 h-10 rounded-lg bg-gray-800" />
          <div className="w-10 h-10 rounded-lg bg-gray-800" />
          <div className="w-10 h-10 rounded-lg bg-gray-800" />
        </div>
      </div>

      {/* Right Control Panel Skeleton */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4 bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800 p-6">
        {/* Tab Headers */}
        <div className="grid grid-cols-4 gap-2 border-b border-gray-800 pb-3">
          <div className="h-8 rounded-lg bg-gray-800" />
          <div className="h-8 rounded-lg bg-gray-800" />
          <div className="h-8 rounded-lg bg-gray-800" />
          <div className="h-8 rounded-lg bg-gray-800" />
        </div>

        {/* Section Title */}
        <div className="w-36 h-5 bg-gray-800 rounded-md my-1" />

        {/* Swatches Grid */}
        <div className="grid grid-cols-5 gap-3 my-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700/50" />
          ))}
        </div>

        {/* Text Inputs */}
        <div className="space-y-3 mt-4">
          <div className="w-24 h-4 bg-gray-800 rounded-md" />
          <div className="w-full h-10 bg-gray-800/80 rounded-xl" />
          <div className="w-24 h-4 bg-gray-800 rounded-md mt-2" />
          <div className="w-full h-10 bg-gray-800/80 rounded-xl" />
        </div>

        {/* Action Button */}
        <div className="w-full h-12 bg-blue-600/50 rounded-xl mt-auto" />
      </div>
    </div>
  );
}
