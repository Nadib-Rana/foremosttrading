"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/features/account/components/AccountSidebar";
import { OrderHistory } from "@/features/account/components/OrderHistory";
import { CartDrawer } from "@/features/customize/components/CartDrawer";
import { KitColors, DesignPattern, PlayerText } from "@/features/customize/types";
import { DEFAULT_COLORS } from "@/features/customize/constants";

export default function OrdersPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Loaded customization states for Cart Drawer
  const [colors, setColors] = useState<KitColors>(DEFAULT_COLORS);
  const [pattern, setPattern] = useState<DesignPattern>("classic");
  const [playerText, setPlayerText] = useState<PlayerText>({
    name: "PLAYER",
    number: "00",
    fontFamily: "font-heading",
    fontSize: 24,
    textColor: "#FFFFFF",
  });
  const [visibleParts, setVisibleParts] = useState<Record<keyof KitColors, boolean>>({
    jerseyBody: true,
    pantBody: true,
    collar: true,
    socks: true,
    borders: true,
  });

  // Load customizer configurations on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedColors = localStorage.getItem("foremost_customizer_colors");
      const storedPattern = localStorage.getItem("foremost_customizer_pattern");
      const storedPlayerText = localStorage.getItem("foremost_customizer_playerText");
      const storedVisibleParts = localStorage.getItem("foremost_customizer_visibleParts");

      if (storedColors) setColors(JSON.parse(storedColors));
      if (storedPattern) setPattern(storedPattern as DesignPattern);
      if (storedPlayerText) setPlayerText(JSON.parse(storedPlayerText));
      if (storedVisibleParts) setVisibleParts(JSON.parse(storedVisibleParts));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col justify-between">
      <div>
        {/* Light theme Navbar */}
        <Navbar theme="light" onCartClick={() => setIsCartOpen(true)} />

        {/* Dashboard Content Workspace */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar */}
            <AccountSidebar activeTab="orders" />

            {/* Main Order History tracking panel */}
            <OrderHistory />
          </div>
        </main>
      </div>

      {/* Footer component */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        colors={colors}
        pattern={pattern}
        playerText={playerText}
        visibleParts={visibleParts}
        frontClosure="Button"
        bodyMaterial="Wool"
        sleevesMaterial="Cow Hide Leather"
        quantity={10}
      />
    </div>
  );
}
