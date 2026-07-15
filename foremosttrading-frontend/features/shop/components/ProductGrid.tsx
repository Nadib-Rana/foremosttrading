"use client";

import { Filter } from "lucide-react";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-2xl bg-white p-6">
        <Filter className="w-8 h-8 text-gray-300 mb-2" />
        <p className="text-sm font-semibold text-gray-500">
          No products match your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
