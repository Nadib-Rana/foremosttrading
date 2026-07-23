"use client";

import { useState } from "react";
import { Plus, Trash2, Ticket, Check, X, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
} from "@/lib/store/api/couponApi";

export default function CouponsPage() {
  const { data: couponsData, isLoading, refetch } = useGetCouponsQuery(undefined);
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(10);
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [error, setError] = useState("");

  const coupons = Array.isArray(couponsData)
    ? couponsData
    : couponsData?.coupons || couponsData?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("Coupon code is required.");
      return;
    }
    try {
      await createCoupon({
        code: code.toUpperCase().replace(/\s+/g, ""),
        discountType,
        discountValue,
        expiryDate,
        isActive: true,
      }).unwrap();
      setCode("");
      setError("");
      refetch();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete coupon:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Coupons</h1>
        <p className="text-sm text-muted-foreground font-medium">Create promotional discount codes and configure bulk checkout rates.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Create Coupon Form */}
        <Card className="border border-border shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">New Discount Code</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2.5 bg-rose-50 text-rose-800 rounded border border-rose-200 text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="coup-code" className="text-xs font-semibold">Promo Code</Label>
                <Input 
                  id="coup-code" 
                  placeholder="e.g. TEAMWORK20" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2 grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="coup-type" className="text-xs font-semibold">Value Type</Label>
                  <select 
                    id="coup-type" 
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Sum ($)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="coup-val" className="text-xs font-semibold">Value</Label>
                  <Input 
                    id="coup-val" 
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="coup-expiry" className="text-xs font-semibold">Expiry Date</Label>
                <Input 
                  id="coup-expiry" 
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" className="w-full text-xs font-semibold h-9">
                <Plus className="mr-1.5 h-4.5 w-4.5" /> Save Coupon
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Coupons Grid List */}
        <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
          {coupons.map((c) => (
            <Card key={c.id} className="border border-border shadow-sm bg-card hover:shadow-md transition-shadow relative">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Ticket className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-extrabold text-foreground">{c.code}</CardTitle>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold">
                      {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `$${c.discountValue} FLAT`}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 pt-2 border-t border-border text-[11px] font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <span>Usage Count:</span>
                  <span className="font-bold text-foreground">{c.usageCount} checkouts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Expiration:</span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" /> {c.expiryDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <span className={`inline-flex items-center rounded px-1.5 py-0.25 text-[9px] font-bold border ${
                    c.isActive 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" 
                      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400"
                  }`}>
                    {c.isActive ? "Active" : "Expired"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
