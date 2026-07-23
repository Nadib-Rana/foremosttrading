"use client";

import { useState } from "react";
import { Download, RefreshCw, Printer, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetProductionQueueQuery,
  useExportProductionItemMutation,
} from "@/lib/store/api/orderApi";

export default function ProductionPage() {
  const { data: queueData, isLoading, refetch } = useGetProductionQueueQuery(undefined);
  const [exportItem, { isLoading: isExporting }] = useExportProductionItemMutation();
  const [exportingId, setExportingId] = useState<string | null>(null);

  const items = Array.isArray(queueData)
    ? queueData
    : queueData?.queue || queueData?.data || [];

  const handleExport = async (id: string) => {
    setExportingId(id);
    try {
      await exportItem(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to export production files:", err);
    } finally {
      setExportingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-gray-400">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Production Print Queue</h1>
          <p className="text-sm text-muted-foreground">Compile customer vector color choices and player rosters into production-ready SVG print files.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Queue
        </Button>
      </div>

      {/* Queue Items */}
      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <Printer className="h-12 w-12 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No items currently pending in the production queue.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item: any) => (
            <Card key={item.id} className="overflow-hidden border border-border">
              <CardHeader className="bg-muted/40 p-4 pb-3 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <Printer className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-sm font-bold">
                      {item.orderItem?.product?.name || "Custom Apparel Kit"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Queue ID: <span className="font-mono">{item.id.slice(0, 8)}</span> • Status: <span className="font-bold uppercase text-primary">{item.status}</span>
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={isExporting && exportingId === item.id}
                  onClick={() => handleExport(item.id)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
                >
                  {isExporting && exportingId === item.id ? (
                    <>
                      <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" /> Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-3.5 w-3.5" /> Export Print SVG
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-3 text-xs space-y-2">
                {item.exportFiles && item.exportFiles.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="font-bold text-gray-700 mb-1">Generated Export Files:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.exportFiles.map((file: any) => (
                        <a
                          key={file.id}
                          href={file.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-md text-[11px] border border-blue-200 transition-colors"
                        >
                          <Download className="h-3 w-3" /> {file.fileType} File ({file.fileUrl.split('/').pop()?.slice(0, 20)}...)
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
