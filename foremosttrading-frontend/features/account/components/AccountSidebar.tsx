"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, FileText, Package } from "lucide-react";
import { api } from "@/services/apiService";

interface AccountSidebarProps {
  activeTab: "account" | "designs" | "orders";
}

export function AccountSidebar({ activeTab }: AccountSidebarProps) {
  const [userName, setUserName] = useState("User Account");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    api.getMe()
      .then((user) => {
        const full =
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.email?.split("@")[0] ||
          "User Account";
        const rawImg = user.profileImageUrl || user.avatarUrl || user.customer?.profileImageUrl || user.customer?.profile?.avatarUrl;
        if (rawImg && !rawImg.includes("unsplash.com")) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
          let finalUrl = rawImg;
          if (!rawImg.startsWith("http://") && !rawImg.startsWith("https://") && !rawImg.startsWith("data:")) {
            const clean = rawImg.startsWith("/") ? rawImg : `/${rawImg}`;
            finalUrl = `${baseUrl}${clean}`;
          }
          setAvatarUrl(finalUrl);
        }
      })
      .catch(() => {});
  }, []);

  const getUserInitials = (n: string) => {
    if (!n) return "U";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full lg:w-64 bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xs flex flex-col gap-6 select-none">
      {/* User Header Info */}
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${userName} profile avatar`}
            className="w-10 h-10 rounded-lg object-cover border border-gray-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EF892A] to-[#D97310] flex items-center justify-center text-white font-heading font-black text-xs shadow-2xs shrink-0">
            {getUserInitials(userName)}
          </div>
        )}
        <span className="font-heading font-black text-sm text-gray-900 tracking-wide truncate">
          {userName}
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex flex-col gap-2.5">
        {/* My Account */}
        <Link
          href="/account"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${
            activeTab === "account"
              ? "bg-[#EF892A] text-white shadow-xs"
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
              ? "bg-[#EF892A] text-white shadow-xs"
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
              ? "bg-[#EF892A] text-white shadow-xs"
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
