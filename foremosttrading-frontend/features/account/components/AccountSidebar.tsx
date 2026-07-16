"use client";

import Link from "next/link";
import { User, FileText, Package } from "lucide-react";

interface AccountSidebarProps {
  activeTab: "account" | "designs" | "orders";
}

export function AccountSidebar({ activeTab }: AccountSidebarProps) {
  const avatarUrl =
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop";

  return (
    <div className="w-full lg:w-64 bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xs flex flex-col gap-6 select-none">
      {/* User Header Info */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt="Rodro Khan profile avatar"
          className="w-10 h-10 rounded-lg object-cover"
        />
        <span className="font-heading font-black text-sm text-gray-900 tracking-wide">
          Rodro Khan
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex flex-col gap-2.5">
        {/* My Account */}
        <Link
          href="/account"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${
            activeTab === "account"
              ? "bg-[#F97316] text-white shadow-xs"
              : "hover:bg-gray-50 text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className={`w-4 h-4 ${activeTab === "account" ? "text-white" : "text-gray-400"}`} />
          My Account
        </Link>

        {/* Saved Designs */}
        <Link
          href="/account/saved-designs"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${
            activeTab === "designs"
              ? "bg-[#F97316] text-white shadow-xs"
              : "hover:bg-gray-50 text-gray-500 hover:text-gray-700"
          }`}
        >
          <FileText className={`w-4 h-4 ${activeTab === "designs" ? "text-white" : "text-gray-400"}`} />
          Saved Designs
        </Link>

        {/* My Orders */}
        <Link
          href="/account/orders"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${
            activeTab === "orders"
              ? "bg-[#F97316] text-white shadow-xs"
              : "hover:bg-gray-50 text-gray-500 hover:text-gray-700"
          }`}
        >
          <Package className={`w-4 h-4 ${activeTab === "orders" ? "text-white" : "text-gray-400"}`} />
          My Orders
        </Link>
      </nav>
    </div>
  );
}
