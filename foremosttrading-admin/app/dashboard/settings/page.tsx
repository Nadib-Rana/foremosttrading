"use client";

import { useState } from "react";
import { 
  Settings, 
  Palette, 
  Mail, 
  Truck, 
  CreditCard, 
  ShieldAlert, 
  Check, 
  Save 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [brandName, setBrandName] = useState("ForemostTrading");
  const [brandColor, setBrandColor] = useState("#FF6600");
  const [shippingRate, setShippingRate] = useState(15);
  const [stripeEnabled, setStripeEnabled] = useState(true);

  // Roles permissions
  const [roles, setRoles] = useState([
    { name: "Super Admin", usersCount: 2, permissions: { products: true, orders: true, settings: true } },
    { name: "Production Manager", usersCount: 3, permissions: { products: true, orders: true, settings: false } },
    { name: "Designer", usersCount: 5, permissions: { products: true, orders: false, settings: false } }
  ]);

  const togglePermission = (roleIndex: number, permKey: string) => {
    setRoles(prev => prev.map((r, i) => {
      if (i === roleIndex) {
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [permKey]: !r.permissions[permKey as keyof typeof r.permissions]
          }
        };
      }
      return r;
    }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground font-medium">Configure store rules, shipping parameters, and team access permissions.</p>
        </div>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground shadow-sm h-9">
          <Save className="mr-1.5 h-4 w-4" /> {saveSuccess ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="grid gap-6 md:grid-cols-4">
        
        {/* Left Side: Navigation Vertical Tabs */}
        <div className="flex flex-col gap-1 border-r border-border pr-2">
          {[
            { id: "general", label: "General Store", icon: Settings },
            { id: "brand", label: "Brand Styling", icon: Palette },
            { id: "shipping", label: "Shipping & Taxes", icon: Truck },
            { id: "roles", label: "Roles & Permissions", icon: ShieldAlert }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg text-left transition-all ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10" 
                  : "text-muted-foreground hover:bg-secondary/45 hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4.5 w-4.5 shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Side: Tab panels */}
        <div className="md:col-span-3">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 mb-4 animate-pulse">
              <Check className="h-4.5 w-4.5" />
              <span>Configurations updated successfully in memory!</span>
            </div>
          )}

          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">General Store Config</CardTitle>
                <CardDescription>Setup portal access parameters and notification routing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="set-name" className="text-xs font-semibold">Store Platform Name</Label>
                  <Input id="set-name" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="set-email" className="text-xs font-semibold">Support Desk Email</Label>
                  <Input id="set-email" defaultValue="support@foremosttrading.com" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* BRAND STYLING TAB */}
          {activeTab === "brand" && (
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand Theme System</CardTitle>
                <CardDescription>Setup brand colors loaded inside customizer canvas palettes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Primary Brand Tint</Label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={brandColor} 
                      onChange={(e) => setBrandColor(e.target.value)} 
                      className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                    />
                    <Input value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="max-w-[150px] font-mono text-xs uppercase" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SHIPPING & TAXES */}
          {activeTab === "shipping" && (
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery Rates & Taxes</CardTitle>
                <CardDescription>Configure shipping surcharges for bulk and individual custom runs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="set-ship" className="text-xs font-semibold">Flat Customizer Shipping Rate ($)</Label>
                  <Input id="set-ship" type="number" value={shippingRate} onChange={(e) => setShippingRate(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-1.5 flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="set-stripe" 
                    checked={stripeEnabled} 
                    onChange={(e) => setStripeEnabled(e.target.checked)} 
                    className="h-4.5 w-4.5 rounded border-border"
                  />
                  <Label htmlFor="set-stripe" className="mt-0 text-xs font-semibold flex items-center gap-1">
                    <CreditCard className="h-4.5 w-4.5 text-primary" /> Enable Stripe Checkout Integration
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ROLES & PERMISSIONS */}
          {activeTab === "roles" && (
            <Card className="border border-border shadow-sm bg-card">
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Access Management</CardTitle>
                <CardDescription>Modify authorization levels for other administrators.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b bg-secondary/35 text-muted-foreground font-semibold">
                        <th className="p-3">Role Hierarchy</th>
                        <th className="p-3 text-center">Write Products</th>
                        <th className="p-3 text-center">Process Orders</th>
                        <th className="p-3 text-center">System Settings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {roles.map((r, roleIdx) => (
                        <tr key={roleIdx} className="hover:bg-muted/30">
                          <td className="p-3 font-bold text-foreground">
                            {r.name}
                            <span className="text-[10px] text-muted-foreground block font-medium mt-0.5">{r.usersCount} users assigned</span>
                          </td>
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={r.permissions.products} 
                              onChange={() => togglePermission(roleIdx, "products")}
                              className="h-3.5 w-3.5 rounded border-border"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={r.permissions.orders} 
                              onChange={() => togglePermission(roleIdx, "orders")}
                              className="h-3.5 w-3.5 rounded border-border"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={r.permissions.settings} 
                              onChange={() => togglePermission(roleIdx, "settings")}
                              className="h-3.5 w-3.5 rounded border-border"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
