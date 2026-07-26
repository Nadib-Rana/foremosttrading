"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "@/services/apiService";
import { DesktopNav, NavLinkItem } from "./DesktopNav";

export function LogoMark({ className = "w-10 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 28C35 28 65 14 100 8C72 15 42 30 10 28Z" fill="#EF892A" />
      <path d="M22 20C45 20 72 10 105 4C78 11 50 22 22 20Z" fill="#EF892A" fillOpacity="0.85" />
      <path d="M5 34C28 34 55 20 90 14C65 22 38 38 5 34Z" fill="#EF892A" fillOpacity="0.7" />
    </svg>
  );
}

export const navLinks: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Customize", href: "/customize" },
  { label: "Teams & Bulk", href: "/teams-and-bulk" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export interface NavbarProps {
  theme?: "dynamic" | "light" | "dark";
  onCartClick?: () => void;
}

export function Navbar({ theme = "dynamic", onCartClick }: NavbarProps) {
  const scrolled = useScroll(10);
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("ft_auth_token") : null;
    if (token) {
      api.getMe()
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  const isLight = theme === "light";
  const avatarImg = useMemo(() => {
    const raw = user?.profileImageUrl || user?.avatarUrl || user?.customer?.profileImageUrl || user?.customer?.profile?.avatarUrl;
    if (!raw) return null;
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:")) return raw;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const clean = raw.startsWith("/") ? raw : `/${raw}`;
    return `${baseUrl}${clean}`;
  }, [user]);

  return (
    <header
      className={cn(
        "transition-all duration-300 ease-in-out z-50",
        isLight
          ? "sticky top-0 left-0 right-0 w-full bg-white border-b border-gray-100 shadow-xs"
          : "fixed top-0 left-0 right-0"
      )}
    >
      <div
        className={cn("w-full transition-all duration-300 ease-in-out", {
          "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg md:top-3 md:w-[90%] xl:w-[90%] 2xl:w-[85%] max-w-7xl md:mx-auto md:rounded-lg md:mt-3": !isLight && scrolled,
          "bg-gradient-to-b from-black/80 to-transparent": !isLight && !scrolled,
        })}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center group py-1">
              <img
                src="/logo/Logo.png"
                alt="FOREMOST"
                className="h-11 md:h-13 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <DesktopNav
              navLinks={navLinks}
              pathname={pathname}
              isLight={isLight}
              user={user}
              avatarImg={avatarImg}
              onCartClick={onCartClick}
            />

            <div className="lg:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onCartClick}
                className={cn(
                  "rounded-lg transition-colors duration-200",
                  isLight
                    ? "text-gray-600 hover:text-primary hover:bg-primary/5"
                    : "text-white hover:text-primary hover:bg-primary/5"
                )}
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <MobileNav isLight={isLight} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
