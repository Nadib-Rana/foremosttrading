"use client";

import { use } from "react";
import { ProductShapesManager } from "@/components/products/ProductShapesManager";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Product Shapes</h2>
        <p className="text-muted-foreground">
          Manage the body shapes and views for the customizer (Front, Back, etc).
        </p>
      </div>

      <ProductShapesManager productId={resolvedParams.id} />
    </div>
  );
}
