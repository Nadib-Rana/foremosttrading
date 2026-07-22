"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDb, MockProduct } from "@/services/mockDb";

export default function CustomizerPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<MockProduct[]>([]);

  useEffect(() => {
    mockDb.initialize();
    mockDb.getProductsAsync()
      .then((all) => {
        const customList = all.filter((p) => p.isCustomizable);
        setProducts(customList);
        setMounted(true);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        const customList = mockDb.getProducts().filter((p) => p.isCustomizable);
        setProducts(customList);
        setMounted(true);
      });
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">Customizer Management</h2>
          <p className="text-sm text-muted-foreground">Select a product model to edit customization layers or test rendering canvases.</p>
        </div>
      </div>
      
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-xs font-semibold flex flex-col items-center gap-2">
            <Palette className="h-8 w-8 text-muted-foreground/60" />
            <span>No customizable models found. Navigate to Products to flag models as Customizable.</span>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full text-xs">
              <thead className="border-b bg-secondary/30">
                <tr className="text-muted-foreground font-semibold">
                  <th className="h-10 px-4 text-left align-middle">Product Model</th>
                  <th className="h-10 px-4 text-left align-middle">Category</th>
                  <th className="h-10 px-4 text-left align-middle">Base Price</th>
                  <th className="h-10 px-4 text-right align-middle">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-4 align-middle font-bold text-foreground">{p.name}</td>
                    <td className="p-4 align-middle capitalize text-muted-foreground">{p.category.toLowerCase()}</td>
                    <td className="p-4 align-middle font-semibold text-foreground">${p.basePrice.toFixed(2)}</td>
                    <td className="p-4 align-middle text-right space-x-2">
                      <Link href={`/dashboard/customizer/${p.id}/editor`}>
                        <Button variant="default" size="sm" className="h-8 text-[10px] font-bold">
                          Launch Canvas Editor
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
