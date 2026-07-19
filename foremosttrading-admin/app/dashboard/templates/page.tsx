"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, FileCode, CheckCircle2 } from "lucide-react";
import { mockDb, MockTemplate } from "@/services/mockDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TemplatesPage() {
  const [mounted, setMounted] = useState(false);
  const [templates, setTemplates] = useState<MockTemplate[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("FOOTBALL");
  const [svgUrl, setSvgUrl] = useState("");
  const [layersCount, setLayersCount] = useState(4);

  useEffect(() => {
    mockDb.initialize();
    setTemplates(mockDb.getTemplates());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const finalUrl = svgUrl || `/templates/${name.toLowerCase().replace(/\s+/g, '-')}.svg`;
    mockDb.saveTemplate({ name, category, svgUrl: finalUrl, layersCount });
    setTemplates(mockDb.getTemplates());
    setName("");
    setSvgUrl("");
    setLayersCount(4);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      mockDb.deleteTemplate(id);
      setTemplates(mockDb.getTemplates());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Canvas Templates</h1>
        <p className="text-sm text-muted-foreground">Manage raw vector blueprints used as bases in customization requests.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Add Template Form */}
        <Card className="border border-border shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Add New Template</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="temp-name" className="text-xs font-semibold">Template Name</Label>
                <Input 
                  id="temp-name" 
                  placeholder="e.g. Sleeveless Training Bib" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="temp-cat" className="text-xs font-semibold">Category Link</Label>
                <select 
                  id="temp-cat" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none"
                >
                  <option value="FOOTBALL">Football</option>
                  <option value="BASKETBALL">Basketball</option>
                  <option value="TENNIS">Tennis</option>
                  <option value="ACCESSORIES">Accessories</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="temp-svg" className="text-xs font-semibold">SVG File Route (Optional)</Label>
                <Input 
                  id="temp-svg" 
                  placeholder="/templates/sleeveless-bib.svg" 
                  value={svgUrl}
                  onChange={(e) => setSvgUrl(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="temp-layers" className="text-xs font-semibold">Estimated Layer Groups</Label>
                <Input 
                  id="temp-layers" 
                  type="number"
                  placeholder="5" 
                  value={layersCount}
                  onChange={(e) => setLayersCount(parseInt(e.target.value) || 2)}
                />
              </div>
              <Button type="submit" size="sm" className="w-full text-xs font-semibold h-9">
                <Plus className="mr-1.5 h-4.5 w-4.5" /> Save Template
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Templates Grid List */}
        <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
          {templates.map((t) => (
            <Card key={t.id} className="border border-border shadow-sm bg-card hover:shadow-md transition-shadow relative">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileCode className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-bold text-foreground line-clamp-1">{t.name}</CardTitle>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold">{t.category}</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  onClick={() => handleDelete(t.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 pt-2 border-t border-border">
                <div className="text-[10px] space-y-1 font-medium">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source URL:</span>
                    <span className="font-mono text-foreground">{t.svgUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color Channels:</span>
                    <span className="font-bold text-primary flex items-center gap-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t.layersCount} Layers
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
