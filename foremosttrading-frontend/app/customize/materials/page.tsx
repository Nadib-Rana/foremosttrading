"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SelectMaterials } from "@/features/customize/components/SelectMaterials";

export default function MaterialsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#F9F9F9] text-gray-900 flex flex-col">
      {/* Light Navbar */}
      <Navbar theme="light" onCartClick={() => setIsCartOpen(true)} />

      {/* Main Material Selection Grid */}
      <SelectMaterials isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />

      {/* Dark Footer */}
      <Footer />
    </main>
  );
}
