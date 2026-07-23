"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1580087443864-44bfa286377e?w=500&auto=format&fit=crop&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(product.image || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(product.image || FALLBACK_IMAGE);
  }, [product.image]);

  return (
    <Link href={`/customize?id=${product.id}`} className="block">
      <div className="group flex flex-col cursor-pointer bg-white rounded-2xl p-3 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        {/* Product Image Area */}
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
          <img
            src={imgSrc}
            alt={product.title}
            loading="lazy"
            decoding="async"
            onError={() => {
              if (imgSrc !== FALLBACK_IMAGE) {
                setImgSrc(FALLBACK_IMAGE);
              }
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Sale Badge */}
          {product.isSale && (
            <span className="absolute top-3 right-3 bg-[#EF4444] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Sale
            </span>
          )}

          {/* Customizable Badge */}
          {product.isCustomizable && (
            <span className="absolute bottom-3 left-3 bg-[#EF892A]/90 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              Customizable
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 px-1 pb-2">
          <h3 className="font-heading text-sm font-black uppercase tracking-wider text-gray-900 leading-snug group-hover:text-[#EF892A] transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed line-clamp-2 min-h-[2.25rem]">
            {product.description}
          </p>

          {/* Price Row */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xs font-bold line-through text-gray-400">
              ${product.originalPrice}
            </span>
            <span className="text-sm font-black text-[#EF892A]">
              ${product.salePrice}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
