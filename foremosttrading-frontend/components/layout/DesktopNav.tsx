"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ShoppingCart, ChevronDown, User as UserIcon } from "lucide-react";

export interface NavLinkItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  navLinks: NavLinkItem[];
  pathname: string;
  isLight: boolean;
  user: any;
  avatarImg: string | null;
  onCartClick?: () => void;
}

export const DesktopNav = memo(function DesktopNav({
  navLinks,
  pathname,
  isLight,
  user,
  avatarImg,
  onCartClick,
}: DesktopNavProps) {
  return (
    <>
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-all duration-200 tracking-wide ${
                isActive
                  ? "text-[#EF892A] font-bold"
                  : isLight
                  ? "text-slate-600 hover:text-[#EF892A]"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

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
    </>
  );
});
