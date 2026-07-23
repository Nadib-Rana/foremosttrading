"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings,
  Palette,
  BarChart3,
  FolderTree,
  FileCode,
  Layers,
  Ticket,
  FileText,
  Image as ImageIcon,
  Bell,
  Fingerprint,
  Printer
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationGroups = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ]
  },
  {
    title: "Catalog",
    items: [
      { name: "Products", href: "/dashboard/products", icon: Package },
      { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
      { name: "Templates", href: "/dashboard/templates", icon: FileCode },
    ]
  },
  {
    title: "Customization",
    items: [
      { name: "Customizer", href: "/dashboard/customizer", icon: Palette },
      { name: "Design Library (SVGs)", href: "/dashboard/design-library", icon: Layers },
      { name: "Production Queue", href: "/dashboard/production", icon: Printer },
    ]
  },
  {
    title: "Sales & Customers",
    items: [
      { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
      { name: "Customers", href: "/dashboard/customers", icon: Users },
    ]
  },
  {
    title: "Marketing & Content",
    items: [
      { name: "Coupons", href: "/dashboard/coupons", icon: Ticket },
      { name: "CMS / Blog", href: "/dashboard/cms", icon: FileText },
      { name: "Media Library", href: "/dashboard/media", icon: ImageIcon },
    ]
  },
  {
    title: "System Settings",
    items: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border overflow-hidden">
      <div className="flex h-16 items-center px-6 gap-3 shrink-0">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black text-sm">
          FT
        </div>
        <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">
          Foremost<span className="text-primary font-black">Trading</span>
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-6 px-3">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10 font-semibold"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium",
                        "group flex items-center rounded-lg px-3 py-2 text-xs transition-all duration-200"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? "text-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground",
                          "mr-2.5 h-4 w-4 flex-shrink-0 transition-colors"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

