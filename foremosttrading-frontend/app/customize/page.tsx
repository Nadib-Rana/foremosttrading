"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchProductSchema } from "@/features/customize/api/customizeApi";
import { ProductSchema } from "@/features/customize/types";
import { SOCCER_JERSEY_SCHEMA } from "@/features/customize/schemas/soccerJerseySchema";
import { Loader2 } from "lucide-react";
import { CustomizeWorkspace } from "./CustomizeWorkspace";

function CustomizePageContent({ initialProductId }: { initialProductId: string | null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [schema, setSchema] = useState<ProductSchema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const targetId = initialProductId || "soccer-jersey";
    setLoading(true);
    fetchProductSchema(targetId)
      .then((s) => {
        setSchema(s || SOCCER_JERSEY_SCHEMA);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading product schema:", err);
        setSchema(SOCCER_JERSEY_SCHEMA);
        setLoading(false);
      });
  }, [initialProductId]);

  if (!isMounted || loading || !schema) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-gray-400" suppressHydrationWarning>
        <Loader2 className="h-8 w-8 animate-spin text-[#EF892A]" />
        <span className="ml-3 text-sm font-medium">Loading product customizer…</span>
      </div>
    );
  }

  return <CustomizeWorkspace key={schema.id} schema={schema} />;
}

function CustomizePageInner() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") || searchParams.get("productId");
  return <CustomizePageContent initialProductId={productId} />;
}

export default function CustomizePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]" suppressHydrationWarning>
        <Loader2 className="h-8 w-8 animate-spin text-[#EF892A]" />
      </div>
    }>
      <CustomizePageInner />
    </Suspense>
  );
}
