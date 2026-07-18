"use client";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ShoppingCart, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Styled athletic wing logo mark matching the FOREMOST logo
export function LogoMark({ className = "w-10 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 28C35 28 65 14 100 8C72 15 42 30 10 28Z" fill="#F97316" />
      <path d="M22 20C45 20 72 10 105 4C78 11 50 22 22 20Z" fill="#F97316" fillOpacity="0.85" />
      <path d="M5 34C28 34 55 20 90 14C65 22 38 38 5 34Z" fill="#F97316" fillOpacity="0.7" />
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

  const isLight = theme === "light";

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
        <nav
          className={cn(
            "container mx-auto flex w-full items-center transition-all duration-300 ease-in-out px-4 sm:px-6 font-sans",
            {
              "h-14": isLight || scrolled,
              "h-16 md:h-20": !isLight && !scrolled,
            }
          )}
        >
          <div className="flex-1 flex items-center justify-start">
            <Link
              href="/"
              className="hover:opacity-80 transition flex flex-col items-center group"
            >
              {isLight ? (
                <>
                  <LogoMark className="w-12 h-6 transition-transform group-hover:scale-105" />
                  <span className="text-[9px] font-heading font-black tracking-[0.3em] text-[#F97316] uppercase mt-0.5 -mr-[0.3em] italic">
                    FOREMOST
                  </span>
                </>
              ) : (
                <Image src="/logo/Logo.png" alt="FOREMOST Logo" width={240} height={60} className="object-contain h-10 lg:h-12 w-auto mix-blend-lighten" />
              )}
            </Link>
          </div>
          
          <div className="hidden lg:flex flex-1 items-center justify-center gap-0 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button
                  key={link.label}
                  variant="ghost"
                  className={cn(
                    "text-xs lg:text-base px-2 lg:px-4 py-2 font-semibold transition-colors duration-200",
                    isLight
                      ? isActive
                        ? "text-[#F97316] font-bold border-b-2 border-[#F97316] rounded-none pb-1"
                        : "text-gray-600 hover:text-[#F97316] hover:bg-gray-50"
                      : isActive
                        ? "text-primary font-bold"
                        : "text-white hover:text-primary hover:bg-white/10"
                  )}
                  render={<Link href={link.href} />}
                  nativeButton={false}
                >
                  {link.label}
                </Button>
              );
            })}
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onCartClick}
                className={cn(
                  "rounded ml-4 w-11 h-11 flex items-center justify-center p-0 shadow-xs",
                  isLight
                    ? "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                    : "bg-black/20 border-white/20 hover:bg-black/40 text-white"
                )}
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {isLight ? (
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1 bg-gray-50 border border-gray-200/80 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  title="My Account"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                    alt="User Profile"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400 mr-1" />
                </Link>
              ) : (
                <Button
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white py-2 px-4.5 rounded-xl font-bold text-xs flex items-center justify-center border-0 cursor-pointer shadow-sm ml-2 h-11"
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
                  "rounded",
                  isLight ? "text-gray-600 hover:bg-gray-50" : "text-white hover:bg-white/10"
                )}
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <MobileNav isLight={isLight} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
