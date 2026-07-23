"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, ArrowUpRight, Calendar, User, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/lib/store/api/orderApi";

export default function OrdersPage() {
  const { data: ordersData, isLoading, refetch } = useGetOrdersQuery(undefined);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  const rawOrders = Array.isArray(ordersData)
    ? ordersData
    : ordersData?.orders || ordersData?.data || [];

  const orders = rawOrders.map((o: any) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customer ? `${o.customer.firstName || ''} ${o.customer.lastName || ''}`.trim() || 'Customer' : 'Customer',
    customerEmail: o.customer?.email || 'customer@example.com',
    status: o.orderStatus || 'PENDING',
    paymentStatus: o.paymentStatus || 'UNPAID',
    totalAmount: Number(o.totalAmount) || 0,
    itemsCount: o.items?.length || 1,
    createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Today',
  }));

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredOrders = orders.filter((o: any) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusTab === "ALL" || o.status.toUpperCase() === statusTab.toUpperCase();
    const matchesPayment = paymentFilter === "ALL" || o.paymentStatus.toUpperCase() === paymentFilter.toUpperCase();
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const orderStatuses = ["ALL", "PENDING", "PROCESSING", "PRINTING", "SHIPPING", "COMPLETED"];

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
                      <select
                        value={o.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await updateOrderStatus({ orderId: o.id, status: newStatus }).unwrap();
                            refetch();
                          } catch (err) {
                            console.error("Failed to update order status:", err);
                          }
                        }}
                        className="text-[10px] font-bold rounded-lg border border-gray-200 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="PRINTING">PRINTING</option>
                        <option value="SHIPPING">SHIPPING</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
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
