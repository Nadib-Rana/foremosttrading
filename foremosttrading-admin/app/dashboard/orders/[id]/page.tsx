"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Printer, 
  Download, 
  Clock, 
  CreditCard, 
  Truck, 
  Layers, 
  User, 
  MapPin,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { mockDb, MockOrder } from "@/services/mockDb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<MockOrder | undefined>(undefined);

  useEffect(() => {
    mockDb.initialize();
    mockDb.getOrderByIdAsync(resolvedParams.id)
      .then(fetched => {
        setOrder(fetched);
        setMounted(true);
      })
      .catch(err => {
        console.error(err);
        setMounted(true);
      });
  }, [resolvedParams.id]);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-rose-500 font-bold border border-dashed rounded-xl">
        Order not found.
      </div>
    );
  }

  const handleStatusProgress = async (nextStatus: MockOrder["status"]) => {
    await mockDb.updateOrderStatusAsync(order.id, nextStatus);
    const updated = await mockDb.getOrderByIdAsync(order.id);
    setOrder(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadPrintConfig = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Number,Size\n" + 
      (order.items[0]?.specifications?.roster || [])
        .map((r: any) => `"${r.name}","${r.number}","${r.size}"`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `print-config-${order.orderNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status mapping index
  const statusIndex = {
    "Pending": 1,
    "Processing": 2,
    "Printing": 3,
    "Shipping": 4,
    "Completed": 5
  }[order.status] || 1;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
              <ChevronLeft className="h-4 w-4 mr-1" /> Orders
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h2 className="text-xl font-bold text-foreground">{order.orderNumber}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs font-semibold">
            <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Invoice
          </Button>
          {order.items[0]?.customized && (
            <Button variant="outline" size="sm" onClick={downloadPrintConfig} className="h-8 text-xs font-semibold">
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" /> Print Roster (CSV)
            </Button>
          )}
        </div>
      </div>

      {/* Production Timeline Progress */}
      <Card className="border border-border shadow-sm print:hidden">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Production Stage</h3>
          <div className="flex items-center justify-between gap-2 relative">
            <div className="absolute top-4 left-0 w-full h-0.5 bg-border -z-10" />
            {[
              { label: "Pending", step: 1 },
              { label: "Processing", step: 2 },
              { label: "Printing", step: 3 },
              { label: "Shipping", step: 4 },
              { label: "Completed", step: 5 }
            ].map((s) => {
              const isPassed = s.step <= statusIndex;
              return (
                <div key={s.label} className="flex flex-col items-center gap-1.5 shrink-0 bg-background px-1">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    isPassed ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground bg-card"
                  }`}>
                    {isPassed ? <CheckCircle className="h-4.5 w-4.5" /> : s.step}
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">{s.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 justify-end border-t pt-4 border-border">
            {order.status === "Pending" && (
              <Button size="sm" className="h-8 text-xs font-bold" onClick={() => handleStatusProgress("Processing")}>Start Processing</Button>
            )}
            {order.status === "Processing" && (
              <Button size="sm" className="h-8 text-xs font-bold" onClick={() => handleStatusProgress("Printing")}>Send to Printing</Button>
            )}
            {order.status === "Printing" && (
              <Button size="sm" className="h-8 text-xs font-bold" onClick={() => handleStatusProgress("Shipping")}>Mark as Shipped</Button>
            )}
            {order.status === "Shipping" && (
              <Button size="sm" className="h-8 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusProgress("Completed")}>Mark Completed</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Sheet */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Side: Invoice Items & Details */}
        <Card className="md:col-span-2 border border-border shadow-sm bg-card print:border-0 print:shadow-none">
          <CardHeader className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base font-extrabold uppercase text-primary">ForemostTrading Admin Invoice</CardTitle>
                <span className="text-[10px] text-muted-foreground font-semibold">REF: {order.orderNumber}</span>
              </div>
              <span className="text-xs text-muted-foreground font-semibold">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Products Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Items</h4>
              <div className="border rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-secondary/35 text-muted-foreground font-semibold">
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-muted/15">
                        <td className="p-2.5">
                          <span className="font-bold text-foreground block">{item.productName}</span>
                          <span className="text-[10px] text-muted-foreground block">Base: ${item.price.toFixed(2)}</span>
                          {item.customized && (
                            <span className="inline-block mt-1 text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                              Custom layout rules applied
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-semibold text-foreground">{item.quantity}</td>
                        <td className="p-2.5 text-right font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customize specifications breakdown */}
            {order.items[0]?.customized && order.items[0]?.specifications && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customization Specifications</h4>
                <div className="grid gap-3 sm:grid-cols-3 bg-secondary/15 p-4 rounded-lg border">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold">Team/Text Target</span>
                    <span className="text-xs font-bold block text-foreground">{order.items[0].specifications.teamName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold">Primary Theme Color</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-4.5 w-4.5 rounded-full border" style={{ backgroundColor: order.items[0].specifications.primaryColor }} />
                      <span className="text-xs font-mono font-semibold uppercase">{order.items[0].specifications.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-semibold">Secondary Accent</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-4.5 w-4.5 rounded-full border" style={{ backgroundColor: order.items[0].specifications.secondaryColor }} />
                      <span className="text-xs font-mono font-semibold uppercase">{order.items[0].specifications.secondaryColor}</span>
                    </div>
                  </div>
                </div>

                {/* Roster list */}
                {order.items[0].specifications.roster && (
                  <div className="space-y-2 mt-4">
                    <h5 className="text-[10px] font-bold text-foreground">Custom Jersey Roster</h5>
                    <div className="border rounded-lg overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b bg-secondary/25 text-muted-foreground font-semibold">
                            <th className="p-2">Name</th>
                            <th className="p-2 text-center">Number</th>
                            <th className="p-2 text-center">Size</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {order.items[0].specifications.roster.map((p: any, idx: number) => (
                            <tr key={idx} className="hover:bg-muted/10">
                              <td className="p-2 font-bold text-foreground">{p.name}</td>
                              <td className="p-2 text-center font-mono font-semibold">{p.number}</td>
                              <td className="p-2 text-center font-bold text-muted-foreground">{p.size}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Side: Shipping & Cost info */}
        <div className="space-y-6">
          
          {/* Cost Card Summary */}
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex justify-between font-semibold text-muted-foreground">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-muted-foreground">
                <span>Shipping (Custom)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-semibold text-muted-foreground">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-sm font-black text-foreground">
                <span>Grand Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Billing details */}
          <Card className="border border-border shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-bold text-foreground block">{order.customerName}</span>
                  <p className="mt-0.5 leading-relaxed font-semibold">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
