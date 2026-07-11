"use client";

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

import Image from 'next/image';

const shapeImageMap: Record<string, string> = {
  "Full Body": "/shapes/full-body-v2.png",
  "Full Hand & Body": "/shapes/full-hand-body-v2.png",
  "Half Body (Full Hand)": "/shapes/half-body-full-hand-v2.png",
  "Half Body (Half Hand)": "/shapes/half-body-half-hand.png",
  "Legs": "/shapes/legs-v2.png",
  "Others": "/shapes/others.png",
};

export function BodyShape3D({ shapeName, interactive = true }: { shapeName: string, interactive?: boolean }) {
  const imageSrc = shapeImageMap[shapeName] || "/shapes/full-body.png";
  
  return (
    <div className="w-full h-full relative flex items-center justify-center min-h-[100px]">
       <Image 
         src={imageSrc}
         alt={shapeName}
         fill
         className="object-contain p-4 transition-opacity duration-300"
         // Using unoptimized to prevent Next.js errors when images are missing during development
         unoptimized 
       />
    </div>
  );
}
