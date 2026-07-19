"use client";

import { useEffect, useState } from "react";
import { Plus, Image as ImageIcon, Trash2, Folder, HardDrive, Download } from "lucide-react";
import { mockDb } from "@/services/mockDb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MediaLibraryPage() {
  const [mounted, setMounted] = useState(false);
  const [media, setMedia] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    mockDb.initialize();
    setMedia(mockDb.getMedia());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  const handleFakeUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const mockImages = [
        "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=300",
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300"
      ];
      const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];
      const newAsset = mockDb.saveMedia({
        name: `athletic_vest_mesh_${Date.now().toString().slice(-4)}.jpg`,
        size: "185 KB",
        type: "image/jpeg",
        url: randomImg
      });
      setMedia(prev => [...prev, newAsset]);
      setIsUploading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground font-medium">Audit patterns, player team emblem SVG logos, and background mockup textures.</p>
        </div>
        <Button onClick={handleFakeUpload} disabled={isUploading} className="bg-primary text-primary-foreground shadow-sm">
          <Plus className="mr-1.5 h-4 w-4" /> {isUploading ? "Uploading..." : "Upload Asset"}
        </Button>
      </div>

      {/* Directory Folder Layout Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { folder: "Product Mockups", count: 4, size: "12.4 MB" },
          { folder: "Customizer Vector Patches", count: 8, size: "1.2 MB" },
          { folder: "Allowed Roster Patterns", count: 5, size: "8.5 MB" }
        ].map((f, idx) => (
          <Card key={idx} className="border border-border shadow-sm bg-card hover:bg-muted/10 cursor-pointer transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Folder className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground leading-tight">{f.folder}</h4>
                <span className="text-[10px] text-muted-foreground font-medium">{f.count} items • {f.size} total</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {media.map((item) => (
          <Card key={item.id} className="border border-border shadow-sm bg-card overflow-hidden group hover:shadow-md transition-shadow">
            <div className="aspect-square bg-secondary/35 flex items-center justify-center relative border-b border-border overflow-hidden">
              {item.url ? (
                <img src={item.url} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                <a href={item.url} target="_blank" rel="noreferrer">
                  <Button size="icon" variant="outline" className="h-8 w-8 bg-white/90 hover:bg-white text-black border-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
            <CardContent className="p-3.5 space-y-1">
              <h4 className="text-[10px] font-bold text-foreground truncate">{item.name}</h4>
              <div className="flex justify-between items-center text-[9px] text-muted-foreground font-medium">
                <span>{item.type.split('/')[1]?.toUpperCase() || "FILE"}</span>
                <span>{item.size}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
