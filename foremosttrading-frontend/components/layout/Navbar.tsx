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
            <Link href="/" className="flex items-center gap-2 group">
              <LogoMark className="w-8 h-8 md:w-9 md:h-9 text-primary transition-transform group-hover:scale-105" />
              <span className="font-heading font-black text-lg md:text-xl tracking-wider text-gray-900">
                FOREMOST<span className="text-[#EF892A]">.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-extrabold transition-all duration-200 tracking-wide",
                      isActive
                        ? "text-[#EF892A] bg-[#EF892A]/10 font-black"
                        : isLight
                        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-gray-200 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onCartClick}
                className={cn(
                  "rounded-lg transition-colors duration-200 h-10 w-10",
                  isLight
                    ? "border-gray-200 text-gray-700 bg-white hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                    : "bg-black/20 border-white/20 text-white hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                )}
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1 bg-gray-50 border border-gray-200/80 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  title="My Account"
                >
                  {avatarImg ? (
                    <img
                      src={avatarImg}
                      alt={user.fullName || "User Profile"}
                      className="w-8 h-8 rounded-lg object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EF892A] to-[#D97310] flex items-center justify-center text-white font-heading font-black text-xs">
                      {user.fullName ? user.fullName[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-400 mr-1" />
                </Link>
              ) : (
                <Button
                  className="bg-[#EF892A] hover:bg-[#D97310] text-white py-2 px-4.5 rounded-lg font-bold text-xs flex items-center justify-center border-0 cursor-pointer shadow-sm ml-2 h-11"
                  render={<Link href="/login" />}
                  nativeButton={false}
                >
                  Log In
                </Button>
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
