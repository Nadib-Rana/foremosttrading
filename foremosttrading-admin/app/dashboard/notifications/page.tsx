"use client";

import { useState } from "react";
import { Bell, Info, AlertTriangle, CheckCircle2, ShieldAlert, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("ALL");
  const [notifications, setNotifications] = useState([
    { id: "1", text: "Vector template 'striped-jersey-kit' successfully analyzed.", type: "success", time: "2 hours ago", read: false },
    { id: "2", text: "Production warning: Jersey back-number layer overlaps with neck collar binding.", type: "warning", time: "5 hours ago", read: false },
    { id: "3", text: "Custom order FT-2026-0001 dispatched to dye-sublimation print department.", type: "info", time: "1 day ago", read: false },
    { id: "4", text: "Security alert: Multiple login attempts detected from unknown IP.", type: "error", time: "2 days ago", read: true },
    { id: "5", text: "New customer Alex Mercer registered a team profile.", type: "info", time: "2 days ago", read: true }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markSingleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filtered = notifications.filter(n => filter === "ALL" || n.type === filter);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground font-medium">Monitor operational logs, layer diagnostic warnings, and system alerts.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead} className="h-8 text-xs font-semibold">
          <Check className="mr-1 h-3.5 w-3.5" /> Mark All as Read
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2">
        {["ALL", "info", "success", "warning", "error"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase transition-all ${
              filter === type 
                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                : "bg-card text-muted-foreground hover:bg-secondary/45"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Alert logs list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-xs text-muted-foreground border-dashed border-2">
            No notifications of this type found.
          </Card>
        ) : (
          filtered.map((n) => {
            const Icon = {
              info: Info,
              success: CheckCircle2,
              warning: AlertTriangle,
              error: ShieldAlert
            }[n.type] || Info;

            const colorClass = {
              info: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
              success: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
              warning: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
              error: "text-rose-500 bg-rose-50 dark:bg-rose-950/20"
            }[n.type] || "text-muted-foreground bg-secondary";

            return (
              <Card key={n.id} className={`border border-border shadow-sm transition-all ${n.read ? "opacity-75" : "bg-primary/5 border-primary/20"}`}>
                <CardContent className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg shrink-0 h-fit ${colorClass}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className={`font-bold leading-tight ${n.read ? "text-foreground/80" : "text-foreground"}`}>{n.text}</p>
                      <span className="text-[10px] text-muted-foreground block mt-1 font-semibold">{n.time}</span>
                    </div>
                  </div>
                  {!n.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markSingleRead(n.id)}
                      className="h-8 text-[10px] shrink-0 font-bold border border-border"
                    >
                      Dismiss
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
