"use client";

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

import Image from 'next/image';

const shapeImageMap: Record<string, string> = {
  "Full Body": "/shapes/cloth-full-body.png",
  "Full Hand & Body": "/shapes/cloth-full-hand-body.png",
  "Half Body (Full Hand)": "/shapes/cloth-half-body-full-hand.png",
  "Half Body (Half Hand)": "/shapes/cloth-half-body-half-hand.png",
  "Legs": "/shapes/cloth-legs.png",
  "Full Pant": "/shapes/cloth-full-pant.png",
  "Half Shirt & Full Pant": "/shapes/cloth-half-shirt-full-pant.png",
  "Full Shirt & Pant": "/shapes/cloth-full-shirt-full-pant.png",
  "Others": "/shapes/cloth-others.png",
};

export function BodyShape3D({ shapeName, interactive = true, customShapeUrl }: { shapeName: string, interactive?: boolean, customShapeUrl?: string }) {
  const imageSrc = customShapeUrl || shapeImageMap[shapeName] || "/shapes/full-body.png";
  
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
