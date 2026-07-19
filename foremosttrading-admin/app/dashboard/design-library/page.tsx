"use client";

import { useState } from "react";
import { 
  Layers, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  FileCode,
  CheckCircle2,
  Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MockSvgLayer {
  id: string;
  name: string;
  type: "Fill" | "Pattern" | "Text" | "Logo";
  visible: boolean;
  locked: boolean;
  defaultColor: string;
  editable: boolean;
  required: boolean;
}

const DEFAULT_LAYERS: MockSvgLayer[] = [
  { id: "layer-collar", name: "collar-panel", type: "Fill", visible: true, locked: false, defaultColor: "#1E3A8A", editable: true, required: true },
  { id: "layer-stripes", name: "stripes-body", type: "Pattern", visible: true, locked: false, defaultColor: "#E0E7FF", editable: true, required: true },
  { id: "layer-sleeves", name: "sleeve-cuffs", type: "Fill", visible: true, locked: false, defaultColor: "#3B82F6", editable: true, required: false },
  { id: "layer-number", name: "back-number-target", type: "Text", visible: true, locked: true, defaultColor: "#FFFFFF", editable: true, required: true }
];

export default function DesignLibraryPage() {
  const [layers, setLayers] = useState<MockSvgLayer[]>(DEFAULT_LAYERS);
  const [svgName, setSvgName] = useState("jersey-athletic-fit.svg");
  const [isUploading, setIsUploading] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setSvgName("new-training-vest.svg");
      setLayers([
        { id: "layer-collar", name: "v-neck-trim", type: "Fill", visible: true, locked: false, defaultColor: "#EF4444", editable: true, required: true },
        { id: "layer-stripes", name: "vest-mesh-base", type: "Fill", visible: true, locked: false, defaultColor: "#171717", editable: true, required: true },
        { id: "layer-sleeves", name: "shoulder-straps", type: "Fill", visible: true, locked: false, defaultColor: "#EF4444", editable: true, required: false }
      ]);
      setIsUploading(false);
    }, 1000);
  };

  const updateLayer = (id: string, fields: Partial<MockSvgLayer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...fields } : l));
  };

  const getCollarColor = () => {
    const l = layers.find(x => x.id === "layer-collar");
    return l && l.visible ? l.defaultColor : "transparent";
  };

  const getBodyColor = () => {
    const l = layers.find(x => x.id === "layer-stripes");
    return l && l.visible ? l.defaultColor : "transparent";
  };

  const getSleevesColor = () => {
    const l = layers.find(x => x.id === "layer-sleeves");
    return l && l.visible ? l.defaultColor : "transparent";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Design Library & SVG Manager</h1>
        <p className="text-sm text-muted-foreground font-medium">Upload custom designs, parse vector assets, and map personalization layer parameters.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* Left column: SVG visualizer and validation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vector Visualizer Canvas */}
          <Card className="border border-border shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vector Mockup Canvas</CardTitle>
                <CardDescription className="text-[10px] truncate max-w-[200px]">{svgName}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-[10px] font-bold"
                onClick={simulateUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload SVG"}
              </Button>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center bg-secondary/20 relative">
              {/* Interactive Vector Jersey */}
              <div className="relative w-44 h-44 flex items-center justify-center transition-all duration-300">
                <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-md">
                  {/* Stripes Body Panel */}
                  <path 
                    d="M30,20 L70,20 L80,45 L70,45 L70,85 L30,85 L30,45 L20,45 Z" 
                    fill={getBodyColor()} 
                    stroke={hoveredLayer === "layer-stripes" || selectedLayer === "layer-stripes" ? "#EF4444" : "#4B5563"}
                    strokeWidth={hoveredLayer === "layer-stripes" || selectedLayer === "layer-stripes" ? "2.5" : "0.5"}
                    className="transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedLayer("layer-stripes")}
                    onMouseEnter={() => setHoveredLayer("layer-stripes")}
                    onMouseLeave={() => setHoveredLayer(null)}
                  />
                  {/* Sleeves cuffs */}
                  <path 
                    d="M20,45 L30,45 L30,20 L20,28 Z M70,45 L80,45 L80,28 L70,20 Z" 
                    fill={getSleevesColor()} 
                    stroke={hoveredLayer === "layer-sleeves" || selectedLayer === "layer-sleeves" ? "#EF4444" : "#4B5563"}
                    strokeWidth={hoveredLayer === "layer-sleeves" || selectedLayer === "layer-sleeves" ? "2.5" : "0.5"}
                    className="transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedLayer("layer-sleeves")}
                    onMouseEnter={() => setHoveredLayer("layer-sleeves")}
                    onMouseLeave={() => setHoveredLayer(null)}
                  />
                  {/* Collar */}
                  <polygon 
                    points="40,20 50,32 60,20 50,20" 
                    fill={getCollarColor()} 
                    stroke={hoveredLayer === "layer-collar" || selectedLayer === "layer-collar" ? "#EF4444" : "#4B5563"}
                    strokeWidth={hoveredLayer === "layer-collar" || selectedLayer === "layer-collar" ? "2.5" : "0.5"}
                    className="transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedLayer("layer-collar")}
                    onMouseEnter={() => setHoveredLayer("layer-collar")}
                    onMouseLeave={() => setHoveredLayer(null)}
                  />
                </svg>
                {hoveredLayer && (
                  <div className="absolute bottom-2 bg-foreground text-background text-[9px] font-bold px-2 py-0.5 rounded shadow">
                    Hovering: {layers.find(l => l.id === hoveredLayer)?.name}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validation card */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SVG Analysis Diagnostics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-[11px] font-medium">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded">
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Valid Closed Vector Paths</span>
                <span className="font-bold">Passed</span>
              </div>
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded">
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Element Names Match IDs</span>
                <span className="font-bold">Passed</span>
              </div>
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
                <span className="flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Contains Text Placeholders</span>
                <span className="font-bold">Manual Mapping Advised</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Detected layers table & manual mapping */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border border-border shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detected Vector Layers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b bg-secondary/35 text-muted-foreground font-semibold">
                      <th className="p-3">Layer Name / ID</th>
                      <th className="p-3">Mapping Type</th>
                      <th className="p-3">Color</th>
                      <th className="p-3 text-center">Customizable</th>
                      <th className="p-3 text-center">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {layers.map((l) => (
                      <tr 
                        key={l.id} 
                        className={`transition-colors hover:bg-muted/30 ${
                          selectedLayer === l.id ? "bg-primary/5" : ""
                        }`}
                        onMouseEnter={() => setHoveredLayer(l.id)}
                        onMouseLeave={() => setHoveredLayer(null)}
                      >
                        <td className="p-3">
                          <button 
                            type="button"
                            className="font-bold text-foreground hover:underline text-left"
                            onClick={() => setSelectedLayer(l.id)}
                          >
                            {l.name}
                          </button>
                        </td>
                        <td className="p-3">
                          <select 
                            value={l.type}
                            onChange={(e) => updateLayer(l.id, { type: e.target.value as any })}
                            className="bg-transparent border border-input rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="Fill">Fill</option>
                            <option value="Pattern">Pattern</option>
                            <option value="Text">Text</option>
                            <option value="Logo">Logo</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="color" 
                              value={l.defaultColor}
                              onChange={(e) => updateLayer(l.id, { defaultColor: e.target.value })}
                              className="w-4 h-4 rounded border border-border p-0 cursor-pointer bg-transparent"
                            />
                            <span className="font-mono text-[9px] uppercase">{l.defaultColor}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={l.editable}
                            onChange={(e) => updateLayer(l.id, { editable: e.target.checked })}
                            className="h-3.5 w-3.5 rounded border-border"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <button 
                              type="button"
                              onClick={() => updateLayer(l.id, { visible: !l.visible })}
                              className={`p-1 rounded hover:bg-secondary text-muted-foreground ${
                                l.visible ? "text-primary" : "text-muted-foreground/45"
                              }`}
                              title={l.visible ? "Hide Layer" : "Show Layer"}
                            >
                              {l.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            </button>
                            <button 
                              type="button"
                              onClick={() => updateLayer(l.id, { locked: !l.locked })}
                              className={`p-1 rounded hover:bg-secondary text-muted-foreground ${
                                l.locked ? "text-amber-500" : "text-muted-foreground/45"
                              }`}
                              title={l.locked ? "Unlock Layer" : "Lock Layer"}
                            >
                              {l.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mapping detail pane for the selected layer */}
              {selectedLayer && (
                <div className="mt-4 p-4 border rounded-lg bg-secondary/15 space-y-3 relative">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-xs font-bold text-foreground">Mapping Rules: <span className="text-primary font-mono">{layers.find(l => l.id === selectedLayer)?.name}</span></h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] text-muted-foreground p-0 hover:bg-transparent"
                      onClick={() => setSelectedLayer(null)}
                    >
                      Close Details
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={layers.find(l => l.id === selectedLayer)?.required}
                        onChange={(e) => updateLayer(selectedLayer, { required: e.target.checked })}
                        className="h-3.5 w-3.5 rounded border-border"
                      />
                      <div>
                        <span className="font-semibold block">Required Selection</span>
                        <span className="text-[9px] text-muted-foreground">User must customize this element to buy.</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={layers.find(l => l.id === selectedLayer)?.locked}
                        onChange={(e) => updateLayer(selectedLayer, { locked: e.target.checked })}
                        className="h-3.5 w-3.5 rounded border-border"
                      />
                      <div>
                        <span className="font-semibold block">Locked Coordinates</span>
                        <span className="text-[9px] text-muted-foreground">Keep canvas layer index locked in background.</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
