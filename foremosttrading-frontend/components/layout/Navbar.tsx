"use client";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const navLinks = [
  { label: "Shop", href: "#" },
  { label: "Customize", href: "#" },
  { label: "Teams & Bulk", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export function Navbar() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        {
          "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg md:top-3 md:w-[90%] xl:w-[90%] 2xl:w-[85%] max-w-7xl md:mx-auto md:rounded-lg": scrolled,
          "bg-gradient-to-b from-black/80 to-transparent": !scrolled,
        }
      )}
    >
      <nav
        className={cn(
          "container mx-auto flex w-full items-center transition-all duration-300 ease-in-out",
          {
            "h-14 px-4 sm:px-6": scrolled,
            "h-16 md:h-20 px-4 sm:px-6": !scrolled,
          }
        )}
      >
        <div className="flex-1 flex items-center justify-start">
          <Link
            href="/"
            className="hover:opacity-80 transition"
          >
            <Image src="/logo/Logo.png" alt="FOREMOST Logo" width={240} height={60} className="object-contain h-10 lg:h-12 w-auto mix-blend-lighten" />
          </Link>
        </div>
        
        <div className="hidden lg:flex flex-1 items-center justify-center gap-0 lg:gap-2">
          {navLinks.map((link) => (
            <Button key={link.label} variant="ghost" className="text-white hover:text-primary hover:bg-white/10 text-xs lg:text-base px-2 lg:px-4 py-2" render={<Link href={link.href} />}>
              {link.label}
            </Button>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-end">
          <div className="hidden lg:block">
            <Button variant="outline" className="rounded bg-black/20 border-white/20 hover:bg-black/40 text-white ml-4 w-11 h-11 flex items-center justify-center p-0">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
          <div className="lg:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded text-white hover:bg-white/10">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
