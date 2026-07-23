"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ShoppingCart, ChevronDown, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { api } from "@/services/apiService";

// Styled athletic wing logo mark matching the FOREMOST logo
export function LogoMark({ className = "w-10 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 28C35 28 65 14 100 8C72 15 42 30 10 28Z" fill="#EF892A" />
      <path d="M22 20C45 20 72 10 105 4C78 11 50 22 22 20Z" fill="#EF892A" fillOpacity="0.85" />
      <path d="M5 34C28 34 55 20 90 14C65 22 38 38 5 34Z" fill="#EF892A" fillOpacity="0.7" />
    </svg>
  );
}

export const navLinks = [
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
  const rawAvatar = user?.profileImageUrl || user?.avatarUrl || user?.customer?.profileImageUrl || user?.customer?.profile?.avatarUrl;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let avatarImg = rawAvatar;
  if (rawAvatar && !rawAvatar.startsWith("http://") && !rawAvatar.startsWith("https://") && !rawAvatar.startsWith("data:")) {
    const clean = rawAvatar.startsWith("/") ? rawAvatar : `/${rawAvatar}`;
    avatarImg = `${baseUrl}${clean}`;
  }

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
        className={cn(
          "w-full transition-all duration-300 ease-in-out",
          {
            "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg md:top-3 md:w-[90%] xl:w-[90%] 2xl:w-[85%] max-w-7xl md:mx-auto md:rounded-lg md:mt-3": !isLight && scrolled,
            "bg-gradient-to-b from-black/80 to-transparent": !isLight && !scrolled,
          }
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center group py-1">
              <img
                src="/logo/Logo.png"
                alt="FOREMOST"
                className="h-11 md:h-13 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-semibold transition-all duration-200 tracking-wide",
                      isActive
                        ? "text-[#EF892A] font-bold"
                        : isLight
                        ? "text-slate-600 hover:text-[#EF892A]"
                        : "text-gray-200 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={onCartClick}
                className="w-10 h-10 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-3xs cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 text-slate-700" />
              </button>

              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-1 p-1 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 rounded-2xl transition-colors cursor-pointer"
                  title="My Account"
                >
                  {avatarImg ? (
                    <img
                      src={avatarImg}
                      alt={user.fullName || "User Profile"}
                      className="w-8 h-8 rounded-xl object-cover shadow-2xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#EF892A] to-[#D97310] flex items-center justify-center text-white font-heading font-black text-xs">
                      {user.fullName ? user.fullName[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-slate-500 mx-1" />
                </Link>
              ) : (
                <Link
                  href="/account"
                  className="flex items-center gap-1 p-1 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 rounded-2xl transition-colors cursor-pointer"
                  title="Account"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-300 flex items-center justify-center text-slate-600">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 mx-1" />
                </Link>
              )}
            </div>
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
