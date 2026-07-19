"use client";

import { useState } from "react";
import { DollarSign, Tag, ShieldCheck, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  const [success, setSuccess] = useState(false);
  const [tiers, setTiers] = useState([
    { minQty: 1, maxQty: 9, discount: 0 },
    { minQty: 10, maxQty: 24, discount: 10 },
    { minQty: 25, maxQty: 49, discount: 15 },
    { minQty: 50, maxQty: 100, discount: 25 }
  ]);

  const [minQty, setMinQty] = useState(101);
  const [maxQty, setMaxQty] = useState(250);
  const [discount, setDiscount] = useState(30);

  const addTier = () => {
    setTiers(prev => [...prev, { minQty, maxQty, discount }]);
    setMinQty(maxQty + 1);
    setMaxQty(maxQty + 100);
  };

  const removeTier = (idx: number) => {
    setTiers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Customization Pricing Rules</h1>
          <p className="text-sm text-muted-foreground font-medium">Define upcharge rules for canvas features and schedule bulk discount tier thresholds.</p>
        </div>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground shadow-sm h-9">
          {success ? "Rules Saved!" : "Save Rules"}
        </Button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
          <Check className="h-4.5 w-4.5" />
          <span>Pricing schedules successfully updated in local store!</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Flat Personalization Upcharges */}
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customizer Surcharges</CardTitle>
            <CardDescription>Upcharge values automatically injected during customer design creation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-medium">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Custom Text Node Charge ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input defaultValue="10.00" className="pl-7" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Custom Logo Placement Charge ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input defaultValue="15.00" className="pl-7" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Sleeve Patch Dye Surcharge ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input defaultValue="5.00" className="pl-7" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volume Pricing Tiers */}
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Volume Discount Schedule</CardTitle>
            <CardDescription>Configure bulk quantity markdown thresholds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b bg-secondary/35 text-muted-foreground font-semibold">
                    <th className="p-2.5">Min Qty</th>
                    <th className="p-2.5">Max Qty</th>
                    <th className="p-2.5">Discount Rate</th>
                    <th className="p-2.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tiers.map((t, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="p-2.5 font-bold text-foreground">{t.minQty} units</td>
                      <td className="p-2.5 font-bold text-foreground">{t.maxQty} units</td>
                      <td className="p-2.5 font-black text-primary">{t.discount}% off</td>
                      <td className="p-2.5 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-rose-500 hover:bg-rose-50"
                          onClick={() => removeTier(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add tier form */}
            <div className="grid gap-2 grid-cols-3 pt-2 items-end">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold">Min</Label>
                <Input type="number" value={minQty} onChange={(e) => setMinQty(parseInt(e.target.value) || 0)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold">Max</Label>
                <Input type="number" value={maxQty} onChange={(e) => setMaxQty(parseInt(e.target.value) || 0)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold">Discount (%)</Label>
                <Input type="number" value={discount} onChange={(e) => setDiscount(parseInt(e.target.value) || 0)} className="h-8 text-xs" />
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full text-xs font-semibold h-8" onClick={addTier}>
              <Plus className="mr-1 h-4 w-4" /> Add Volume Tier
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
