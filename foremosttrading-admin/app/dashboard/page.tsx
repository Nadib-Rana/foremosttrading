"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package, 
  Sparkles, 
  ArrowUpRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Layers,
  Calendar,
  AlertCircle
} from "lucide-react";
import { mockDb, MockProduct, MockOrder } from "@/services/mockDb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardOverviewPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    mockDb.initialize();
    Promise.all([
      mockDb.getProductsAsync(),
      mockDb.getOrdersAsync()
    ]).then(([fetchedProducts, fetchedOrders]) => {
      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
      setCustomersCount(mockDb.getCustomers().length);
      setMounted(true);
    }).catch(err => {
      console.error(err);
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  // Calculate statistics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const customizationRequests = products.filter(p => p.isCustomizable).length;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: "+18.2% from last month",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400"
    },
    {
      title: "Active Orders",
      value: orders.length.toString(),
      description: `${pendingOrders} awaiting fulfillment`,
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400"
    },
    {
      title: "Total Customers",
      value: customersCount.toString(),
      description: "+4 new signups this week",
      icon: Users,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400"
    },
    {
      title: "Total Products",
      value: products.length.toString(),
      description: `${customizationRequests} customizable templates`,
      icon: Package,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400"
    }
  ];

  const recentOrders = orders.slice(0, 5);
  const recentProducts = products.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Admin</h1>
          <p className="text-sm text-muted-foreground">Here's a look at your shop customization platform performance today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/products/new">
            <Button size="sm" className="bg-primary text-primary-foreground shadow-sm">
              <Plus className="mr-1.5 h-4 w-4" /> Add Product
            </Button>
          </Link>
          <Link href="/dashboard/design-library">
            <Button size="sm" variant="outline" className="shadow-sm">
              <Layers className="mr-1.5 h-4 w-4" /> Upload SVG
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                <span className="text-emerald-500 font-bold">↑</span>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts / Leaderboards Grid */}
      <div className="grid gap-6 md:grid-cols-6">
        
        {/* Sales Chart Container (using SVG) */}
        <Card className="col-span-full md:col-span-4 border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Sales Analytics</CardTitle>
              <CardDescription>Visualizing weekly customized order performance</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md border border-border">
              <Calendar className="h-3.5 w-3.5" />
              <span>Last 7 Days</span>
            </div>
          </CardHeader>
          <CardContent className="h-72 flex flex-col justify-end">
            {/* Mock Chart SVG Render */}
            <div className="w-full flex items-end justify-between h-48 px-4 border-b border-border">
              {[
                { day: "Mon", val: 35, orders: 4 },
                { day: "Tue", val: 55, orders: 8 },
                { day: "Wed", val: 40, orders: 5 },
                { day: "Thu", val: 78, orders: 12 },
                { day: "Fri", val: 95, orders: 16 },
                { day: "Sat", val: 60, orders: 9 },
                { day: "Sun", val: 85, orders: 14 }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                  <div className="relative w-full flex justify-center">
                    <div 
                      className="w-8 md:w-10 rounded-t bg-primary/20 group-hover:bg-primary transition-all duration-300 relative flex justify-center"
                      style={{ height: `${item.val * 1.5}px` }}
                    >
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-bold py-1 px-2 rounded shadow-md z-10 whitespace-nowrap">
                        {item.orders} Orders
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Custom Orders
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary/20" />
                Total Orders
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Top Templates */}
        <Card className="col-span-full md:col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Top Custom Templates</CardTitle>
            <CardDescription>Most customized products this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0 border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg overflow-hidden border border-border shrink-0 bg-secondary flex items-center justify-center">
                    {p.images && p.images[0] ? (
                      <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground line-clamp-1">{p.name}</h4>
                    <span className="text-[10px] text-muted-foreground capitalize">{p.category.toLowerCase()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-foreground">${p.basePrice}</span>
                  <div className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">84% customizations</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Lower section: Recent Orders and Activity Logs */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Recent Orders table */}
        <Card className="md:col-span-2 border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Recent Customization Requests</CardTitle>
              <CardDescription>Latest orders with user-configured layouts</CardDescription>
            </div>
            <Link href="/dashboard/orders">
              <Button size="sm" variant="ghost" className="text-xs text-primary hover:text-primary/95">
                View All <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left pb-2">
                    <th className="font-semibold pb-2">Order</th>
                    <th className="font-semibold pb-2">Customer</th>
                    <th className="font-semibold pb-2">Amount</th>
                    <th className="font-semibold pb-2">Status</th>
                    <th className="font-semibold pb-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 font-bold text-foreground">
                        <Link href={`/dashboard/orders/${o.id}`} className="hover:underline">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="py-2.5">
                        <div className="font-semibold text-foreground">{o.customerName}</div>
                        <div className="text-[10px] text-muted-foreground">{o.customerEmail}</div>
                      </td>
                      <td className="py-2.5 font-semibold text-foreground">${o.total.toFixed(2)}</td>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          o.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" :
                          o.status === "Printing" ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400" :
                          o.status === "Processing" ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400" :
                          "bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground">{new Date(o.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Activity Log</CardTitle>
            <CardDescription>Live operations and system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { text: "Admin published product 'Evolution Football Jersey'", icon: CheckCircle2, time: "2 hours ago", color: "text-emerald-500" },
              { text: "Customized order FT-2026-0001 sent to Print Production", icon: Layers, time: "3 hours ago", color: "text-blue-500" },
              { text: "New customer Alex Mercer registered", icon: Users, time: "1 day ago", color: "text-purple-500" },
              { text: "SVG upload 'striped-jersey-kit' passed layer validation", icon: Sparkles, time: "1 day ago", color: "text-amber-500" },
              { text: "System Warning: Shipping API mock endpoint offline", icon: AlertCircle, time: "2 days ago", color: "text-rose-500" }
            ].map((activity, index) => (
              <div key={index} className="flex gap-3 text-xs border-b last:border-b-0 pb-3 last:pb-0 border-border">
                <activity.icon className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${activity.color}`} />
                <div>
                  <p className="font-semibold text-foreground leading-tight">{activity.text}</p>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
