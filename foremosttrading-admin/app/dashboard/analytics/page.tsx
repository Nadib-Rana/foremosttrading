"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Sparkles, Users, Award, ShoppingBag } from "lucide-react";
import { mockDb, MockProduct, MockOrder, MockCustomer } from "@/services/mockDb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [customers, setCustomers] = useState<MockCustomer[]>([]);

  useEffect(() => {
    mockDb.initialize();
    setProducts(mockDb.getProducts());
    setOrders(mockDb.getOrders());
    setCustomers(mockDb.getCustomers());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  // Sorting data for analytics leaderboards
  const topProducts = [...products].sort((a,b) => b.basePrice - a.basePrice).slice(0, 3);
  const topCustomers = [...customers].sort((a,b) => b.totalSpent - a.totalSpent).slice(0, 3);

  // Conversion funnel stages count
  const funnelStages = [
    { name: "Platform Visitors", count: 8520, percent: 100, color: "bg-blue-500/20 text-blue-700 dark:text-blue-400" },
    { name: "Canvas Editor Loaded", count: 3410, percent: 40, color: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-400" },
    { name: "Roster Sizes Added", count: 1364, percent: 16, color: "bg-purple-500/20 text-purple-700 dark:text-purple-400" },
    { name: "Completed Checkouts", count: 682, percent: 8, color: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground font-medium">Analyze sales funnels, customization rates, and high-value customer logs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Conversion Funnel Card */}
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customization Funnel Conversion</CardTitle>
            <CardDescription>Track conversion rates from visitor load to roster purchase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1.5 text-xs font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-bold">{stage.name}</span>
                  <span className="text-muted-foreground font-semibold">{stage.count.toLocaleString()} ({stage.percent}%)</span>
                </div>
                <div className="h-4 w-full bg-secondary rounded overflow-hidden">
                  <div className={`h-full ${stage.color.split(' ')[0]} transition-all`} style={{ width: `${stage.percent}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performers Grid */}
        <div className="grid gap-4">
          {/* Top Products */}
          <Card className="border border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Award className="h-4.5 w-4.5 text-amber-500" /> High-Value Canvas Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-medium">
              {topProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0 border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-muted-foreground">#{idx + 1}</span>
                    <span className="text-foreground font-bold truncate max-w-[200px]">{p.name}</span>
                  </div>
                  <span className="font-bold text-foreground">${p.basePrice.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card className="border border-border shadow-sm bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Users className="h-4.5 w-4.5 text-primary" /> Top Spending Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-medium">
              {topCustomers.map((c, idx) => (
                <div key={c.id} className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0 border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-muted-foreground">#{idx + 1}</span>
                    <span className="text-foreground font-bold">{c.name}</span>
                  </div>
                  <span className="font-black text-foreground">${c.totalSpent.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
