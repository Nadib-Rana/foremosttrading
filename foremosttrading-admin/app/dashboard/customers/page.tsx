"use client";

import { useEffect, useState } from "react";
import { Users, Mail, DollarSign, ShoppingBag, MapPin, Eye, FileText } from "lucide-react";
import { mockDb, MockCustomer } from "@/services/mockDb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  const [mounted, setMounted] = useState(false);
  const [customers, setCustomers] = useState<MockCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(null);

  useEffect(() => {
    mockDb.initialize();
    const list = mockDb.getCustomers();
    setCustomers(list);
    if (list.length > 0) {
      setSelectedCustomer(list[0]);
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground font-medium">Audit client purchase history, saved canvas presets, and shipping records.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Customers list */}
        <Card className="lg:col-span-2 border border-border shadow-sm bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b bg-secondary/35 text-muted-foreground font-semibold">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Orders</th>
                  <th className="p-3">Total Spent</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-muted/30 transition-colors ${
                      selectedCustomer?.id === c.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="p-3 flex items-center gap-3">
                      <div className="h-8.5 w-8.5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{c.name}</h4>
                        <span className="text-[10px] text-muted-foreground block">{c.email}</span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-muted-foreground">{c.ordersCount} Orders</td>
                    <td className="p-3 font-bold text-foreground">${c.totalSpent.toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-[10px] font-bold border"
                        onClick={() => setSelectedCustomer(c)}
                      >
                        Inspect <Eye className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Side: Customer Detailed Inspect Block */}
        {selectedCustomer && (
          <Card className="border border-border shadow-sm bg-card h-fit">
            <CardHeader className="border-b pb-3.5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5 text-xs">
              {/* Client meta details */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-extrabold text-foreground">{selectedCustomer.name}</h3>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" /> {selectedCustomer.email}
                </span>
              </div>

              {/* Purchase statistics */}
              <div className="grid grid-cols-2 gap-3 bg-secondary/15 p-3 rounded-lg border">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-semibold">Total Revenue</span>
                  <span className="text-sm font-black text-foreground">${selectedCustomer.totalSpent.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block font-semibold">Completed Runs</span>
                  <span className="text-sm font-black text-foreground">{selectedCustomer.ordersCount} runs</span>
                </div>
              </div>

              {/* Saved Designs */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <FileText className="h-4 w-4 text-primary" /> Saved Designs
                </h4>
                {selectedCustomer.savedDesigns.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">No saved designs found.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedCustomer.savedDesigns.map((d: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-2 border rounded bg-card hover:bg-muted/10">
                        <div>
                          <span className="font-bold text-foreground block">{d.name}</span>
                          <span className="text-[9px] text-muted-foreground uppercase">{d.category}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-medium">Updated {d.lastUpdated}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Addresses */}
              <div className="space-y-2 pt-2.5 border-t border-border">
                <h4 className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" /> Address Record
                </h4>
                {selectedCustomer.addresses.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground italic">No address on file.</p>
                ) : (
                  <div className="space-y-1.5 font-medium text-muted-foreground">
                    {selectedCustomer.addresses.map((a: any, idx: number) => (
                      <div key={idx} className="p-2 border rounded bg-card">
                        <span className="font-bold text-foreground text-[10px] block mb-0.5">{a.label} Address</span>
                        <p className="text-[10px] leading-relaxed">
                          {a.street}, {a.city}, {a.state} {a.zip}, {a.country}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
