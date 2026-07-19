"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, ArrowUpRight, Calendar, User, Package, Check } from "lucide-react";
import { mockDb, MockOrder } from "@/services/mockDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  useEffect(() => {
    mockDb.initialize();
    setOrders(mockDb.getOrders());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusTab === "ALL" || o.status === statusTab;
    const matchesPayment = paymentFilter === "ALL" || o.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const orderStatuses = ["ALL", "Pending", "Processing", "Printing", "Shipping", "Completed"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders & Production Logs</h1>
        <p className="text-sm text-muted-foreground">Monitor customized team print runs, dispatch shipments, and print templates.</p>
      </div>

      {/* Production Status Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {orderStatuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusTab(status)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all relative ${
              statusTab === status 
                ? "border-primary text-primary font-black bg-primary/5" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/35"
            }`}
          >
            {status}
            {status !== "ALL" && (
              <span className="ml-1.5 px-1.5 py-0.25 bg-secondary text-muted-foreground text-[9px] rounded-full border">
                {orders.filter(o => o.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by order ID, client name, or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/35 text-xs"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-secondary/15 px-3 text-xs font-semibold focus-visible:outline-none"
          >
            <option value="ALL">All Payments</option>
            <option value="Paid">Paid Only</option>
            <option value="Unpaid">Unpaid Only</option>
          </select>
        </div>
      </div>

      {/* Grid table */}
      <Card className="border border-border shadow-sm overflow-hidden bg-card">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-xs font-semibold flex flex-col items-center justify-center gap-2">
            <ShoppingCart className="h-8 w-8 text-muted-foreground/60" />
            <span>No orders found matching the filter criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b bg-secondary/35 text-muted-foreground font-semibold">
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Production Status</th>
                  <th className="p-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">
                      <Link href={`/dashboard/orders/${o.id}`} className="hover:underline">
                        {o.orderNumber}
                      </Link>
                      <span className="text-[10px] text-muted-foreground block mt-0.5 font-medium">
                        {new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-foreground">{o.customerName}</div>
                      <div className="text-[10px] text-muted-foreground">{o.customerEmail}</div>
                    </td>
                    <td className="p-3.5 font-medium text-muted-foreground">
                      {o.items.reduce((sum, item) => sum + item.quantity, 0)} Pcs
                      <span className="text-[10px] text-primary font-bold block">
                        {o.items[0]?.customized ? "Custom Roster Layout" : "Standard Model"}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-foreground">${o.total.toFixed(2)}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                        o.paymentStatus === "Paid" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" 
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400"
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                        o.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" :
                        o.status === "Printing" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400" :
                        o.status === "Processing" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400" :
                        "bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-850 dark:text-zinc-300"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link href={`/dashboard/orders/${o.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold border">
                          Manage <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
