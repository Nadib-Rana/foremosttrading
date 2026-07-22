"use client";

import { useState, useEffect, use, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  Droplet, 
  Shapes, 
  Type,
  Upload,
  Type as TypeIcon,
  Trash2,
  Download,
  Loader2,
  ArrowLeft,
  SlidersHorizontal,
  Layers,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockDb } from "@/services/mockDb";
import { ProductCanvas, ProductCanvasRef } from "@/components/customizer/ProductCanvas";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const resolveUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const SUPPORTED_TAGS = ["path", "rect", "circle", "ellipse", "polygon", "polyline", "line", "text", "image", "use", "g"];

function DynamicSvgRenderer({
  svgUrl,
  svgRaw,
  colors,
  selectedLayerId,
  onLayerSelect,
}: {
  svgUrl?: string;
  svgRaw?: string;
  colors: Record<string, string>;
  selectedLayerId?: string | null;
  onLayerSelect?: (elementId: string) => void;
}) {
  const [svgContent, setSvgContent] = useState<string | null>(svgRaw || null);
  const [loading, setLoading] = useState(!svgRaw && Boolean(svgUrl));
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (svgRaw) {
      setSvgContent(svgRaw);
      setLoading(false);
      return;
    }
    if (!svgUrl) return;
    setLoading(true);
    setError(null);
    fetch(svgUrl)
      .then((res) => {
        if (!res.ok) throw new Error("SVG load failed (" + res.status + ")");
        return res.text();
      })
      .then((text) => {
        setSvgContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("SVG fetch error:", err);
        setError("Failed to load SVG template.");
        setLoading(false);
      });
  }, [svgUrl, svgRaw]);

  const applyPatches = useCallback(() => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector("svg");
    if (!svgEl) return;

    Object.entries(colors).forEach(([elementId, color]) => {
      const el = svgEl.querySelector("#" + CSS.escape(elementId)) as HTMLElement | SVGElement | null;
      if (!el) return;
      el.style.cursor = "pointer";
      el.style.filter = "";

      const stroke = el.getAttribute("stroke");
      const fill = el.getAttribute("fill");
      if (stroke && stroke !== "none" && (!fill || fill === "none")) {
        el.setAttribute("stroke", color);
      } else {
        el.setAttribute("fill", color);
        el.querySelectorAll(SUPPORTED_TAGS.join(",")).forEach((c) => {
          const cf = c.getAttribute("fill");
          if (cf && cf !== "none") c.setAttribute("fill", color);
        });
      }
    });

    if (selectedLayerId) {
      const selectedEl = svgEl.querySelector("#" + CSS.escape(selectedLayerId)) as HTMLElement | SVGElement | null;
      if (selectedEl) {
        selectedEl.style.filter = "drop-shadow(0 0 5px #2563eb) drop-shadow(0 0 10px #3b82f6)";
        selectedEl.style.transition = "filter 0.2s ease-in-out";
      }
    }

    svgEl.setAttribute("width", "100%");
    svgEl.setAttribute("height", "100%");
    svgEl.style.width = "100%";
    svgEl.style.height = "100%";
    svgEl.style.maxWidth = "100%";
    svgEl.style.maxHeight = "100%";
  }, [colors, selectedLayerId]);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;
    containerRef.current.innerHTML = svgContent;
    applyPatches();

    const svgEl = containerRef.current.querySelector("svg");
    if (!svgEl) return;

    const handleClick = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;
      while (target && target !== svgEl) {
        const id = target.getAttribute("id");
        if (id && colors.hasOwnProperty(id)) {
          if (onLayerSelect) {
            onLayerSelect(id);
          }
          break;
        }
        target = target.parentElement;
      }
    };

    svgEl.addEventListener("click", handleClick);
    return () => {
      svgEl.removeEventListener("click", handleClick);
    };
  }, [svgContent, applyPatches, colors, onLayerSelect]);

  useEffect(() => {
    if (!svgContent) return;
    applyPatches();
  }, [colors, selectedLayerId, applyPatches, svgContent]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs font-medium">Loading SVG preview…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-amber-600 text-xs font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
    />
  );
}

const tabs = [
  { id: "views", label: "Views", icon: Palette },
  { id: "colors", label: "Colors", icon: Droplet },
  { id: "elements", label: "Elements", icon: Shapes },
  { id: "text", label: "Text", icon: Type },
];

const PRESET_COLORS = [
  "#FFFFFF", "#000000", "#FF3B30", "#FF9500", "#FFCC00", 
  "#4CD964", "#5AC8FA", "#007AFF", "#5856D6", "#FF2D55", 
  "#555555", "#8E8E93"
];

interface ProductView {
  id: string;
  name: string;
  svgUrl?: string;
  svgRaw?: string;
  viewOrder?: number;
  layers?: Array<{
    id: string;
    elementId: string;
    layerName: string;
    defaultColor?: string;
  }>;
}

interface ProductSchema {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  images: string[];
  isCustomizable: boolean;
  isActive: boolean;
  svgUrl?: string | null;
  svgRaw?: string | null;
  views: ProductView[];
  customizableParts: Array<{
    id: string;
    label: string;
    defaultColor: string;
    isEditable?: boolean;
    isRequired?: boolean;
    isLocked?: boolean;
  }>;
  defaultColors: Record<string, string>;
}

export default function CustomizerEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductSchema | null>(null);
  
  const [activeTab, setActiveTab] = useState("colors");
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [layerColors, setLayerColors] = useState<Record<string, string>>({});
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  // Text state
  const [textInput, setTextInput] = useState("YOUR TEXT");
  const [textColor, setTextColor] = useState("#000000");

  const canvasRef = useRef<ProductCanvasRef>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);

    mockDb.fetchApi(`/products/${productId}/config-schema`)
      .then((res) => {
        const data = res?.data !== undefined ? res.data : res;
        const parsedProduct: ProductSchema = {
          id: data.id || productId,
          slug: data.slug || productId,
          name: data.name || "Custom Product",
          description: data.description || "",
          category: data.category || "Apparel",
          basePrice: Number(data.basePrice) || 0,
          images: data.images || [],
          isCustomizable: Boolean(data.isCustomizable),
          isActive: Boolean(data.isActive),
          svgUrl: data.svgUrl || null,
          svgRaw: data.svgRaw || null,
          views: data.views || [],
          customizableParts: data.customizableParts || [],
          defaultColors: data.defaultColors || {},
        };

        setProduct(parsedProduct);

        if (parsedProduct.defaultColors && Object.keys(parsedProduct.defaultColors).length > 0) {
          setLayerColors(parsedProduct.defaultColors);
        } else if (parsedProduct.customizableParts) {
          const initial: Record<string, string> = {};
          parsedProduct.customizableParts.forEach((p: any) => {
            initial[p.id] = p.defaultColor || "#FFFFFF";
          });
          setLayerColors(initial);
        }

        if (parsedProduct.customizableParts && parsedProduct.customizableParts.length > 0) {
          setActiveLayerId(parsedProduct.customizableParts[0].id);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to fetch product config schema, trying product endpoint:", err);
        mockDb.fetchApi(`/products/${productId}`)
          .then((res) => {
            const prod = res?.data !== undefined ? res.data : res;
            setProduct({
              id: prod.id || productId,
              slug: prod.slug || productId,
              name: prod.name || "Custom Product",
              description: prod.description || "",
              category: prod.category?.name || "Apparel",
              basePrice: Number(prod.basePrice) || 0,
              images: prod.images?.map((i: any) => i.imageUrl) || [],
              isCustomizable: Boolean(prod.isCustomizable),
              isActive: Boolean(prod.isActive),
              views: [],
              customizableParts: [],
              defaultColors: {},
            });
            setLoading(false);
          })
          .catch((e) => {
            console.error("Failed to fetch product:", e);
            setError("Failed to load product from backend");
            setLoading(false);
          });
      });
  }, [productId]);

  const handleSelectLayer = (layerId: string) => {
    setActiveTab("colors");
    setActiveLayerId(layerId);
    setTimeout(() => {
      if (colorInputRef.current) {
        colorInputRef.current.focus();
        colorInputRef.current.click();
      }
    }, 100);
  };

  const handleAddText = () => {
    if (canvasRef.current) {
      canvasRef.current.addText(textInput, { fill: textColor });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvasRef.current) {
      const url = URL.createObjectURL(file);
      canvasRef.current.addImage(url);
    }
    e.target.value = "";
  };

  const handleDelete = () => {
    if (canvasRef.current) {
      canvasRef.current.deleteSelected();
    }
  };

  const handleSaveDesign = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.saveCanvas();
      const link = document.createElement("a");
      link.href = dataUrl;
      const currentView = product?.views[activeViewIndex]?.name || "custom";
      link.download = `${product?.slug || "design"}-${currentView.toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleColorChange = (layerId: string, color: string) => {
    setLayerColors((prev) => ({
      ...prev,
      [layerId]: color,
    }));
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f5f7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-muted-foreground">Loading product record from backend…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#f4f5f7]">
        <h2 className="text-xl font-bold text-destructive">Product Load Error</h2>
        <p className="text-sm text-muted-foreground">{error || "Product record not found."}</p>
        <Link href="/dashboard/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Product Listing
          </Button>
        </Link>
      </div>
    );
  }

  const currentView = product.views && product.views.length > 0 ? product.views[activeViewIndex] : null;
  const activeSvgUrl = resolveUrl(currentView?.svgUrl || product.svgUrl || (product.images && product.images[0]) || "");
  const activeSvgRaw = currentView?.svgRaw || product.svgRaw || undefined;

  return (
    <div className="flex h-screen bg-[#f4f5f7] overflow-hidden -m-8">
      {/* Header Info */}
      <div className="absolute top-4 left-8 z-10 flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="outline" size="sm" className="h-9 px-2.5 bg-white border-gray-200 hover:bg-gray-50 shadow-sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Products
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-gray-900">{product.name}</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {product.category}
            </span>
          </div>
          <p className="font-bold text-base text-[#f48a27]">
            ${(Number(product.basePrice) || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 w-full h-full p-8 pt-24 gap-6">
        
        {/* Left Pane: Preview Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
             <div className="absolute inset-0 bg-gray-50/50 rounded-lg overflow-hidden flex flex-col items-center justify-center p-6">
                
                {/* Overlay Action Tools */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleDelete} className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600 shadow-sm border-gray-200" title="Delete Selected Item">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* SVG Vector Preview & Dynamic Color Patching */}
                {(activeSvgUrl || activeSvgRaw) ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <DynamicSvgRenderer 
                      svgUrl={activeSvgUrl} 
                      svgRaw={activeSvgRaw} 
                      colors={layerColors} 
                      selectedLayerId={activeLayerId}
                      onLayerSelect={handleSelectLayer}
                    />
                    <div className="absolute inset-0 pointer-events-none [&_canvas]:pointer-events-auto">
                      <ProductCanvas 
                        ref={canvasRef} 
                        shapeName={currentView?.name || "Product View"} 
                        tintColor="transparent" 
                        customShapeUrl=""
                      />
                    </div>
                  </div>
                ) : (
                  <ProductCanvas 
                    ref={canvasRef} 
                    shapeName={currentView?.name || "Product View"} 
                    tintColor="transparent" 
                    customShapeUrl=""
                  />
                )}

             </div>
          </div>
        </div>

        {/* Right Pane: Controls */}
        <div className="w-[400px] flex flex-col gap-4">
          <Card className="flex-1 border-gray-100 shadow-sm flex flex-col overflow-hidden bg-white">
            <CardContent className="p-4 flex flex-col h-full gap-4">
              
              {/* Tabs Header */}
              <div className="grid grid-cols-4 gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex flex-col items-center justify-center py-3 rounded-lg border transition-all text-xs font-medium gap-1.5",
                        isActive 
                          ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      )}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* VIEWS TAB */}
                {activeTab === "views" && (
                  <div className="flex flex-col gap-4 pb-4">
                    <h3 className="font-semibold text-gray-800 text-sm">Product Views</h3>
                    <p className="text-xs text-gray-500">Loaded views for <strong>{product.name}</strong> from database.</p>

                    {product.views && product.views.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {product.views.map((view, i) => (
                          <div 
                            key={view.id || i}
                            onClick={() => setActiveViewIndex(i)}
                            className={cn(
                              "p-3 rounded-lg border-2 cursor-pointer transition-all shadow-sm flex flex-col items-center justify-center gap-2 group text-center",
                              activeViewIndex === i 
                                ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20" 
                                : "border-gray-200 bg-gray-50 hover:border-blue-400"
                            )}
                          >
                            {view.svgUrl ? (
                              <img src={resolveUrl(view.svgUrl)} alt={view.name} className="h-20 w-auto object-contain" />
                            ) : (
                              <Layers className="h-8 w-8 text-blue-600" />
                            )}
                            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                              {view.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 space-y-3">
                        <SlidersHorizontal className="h-8 w-8 text-gray-400 mx-auto" />
                        <p className="text-xs text-gray-600 font-medium">No SVG view templates uploaded yet for this product record.</p>
                        <Link href={`/dashboard/products/${product.id}`}>
                          <Button size="sm" variant="outline" className="text-xs mt-1">
                            Upload SVG Views
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* COLORS TAB */}
                {activeTab === "colors" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-800 text-sm">Layer Customization</h3>
                    <p className="text-xs text-gray-500">Click any SVG part on the garment or choose a layer below.</p>

                    {product.customizableParts && product.customizableParts.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {/* Layer List Chips */}
                        <div className="flex flex-wrap gap-1.5 pb-1">
                          {product.customizableParts.map((part) => {
                            const isSelected = activeLayerId === part.id;
                            return (
                              <button
                                key={part.id}
                                onClick={() => setActiveLayerId(part.id)}
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5",
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600/30"
                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                )}
                              >
                                <span 
                                  className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0" 
                                  style={{ backgroundColor: layerColors[part.id] || "#FFFFFF" }} 
                                />
                                {part.label}
                              </button>
                            );
                          })}
                        </div>

                        <label className="text-xs font-semibold text-gray-700 mt-1">Active Parsed Layer:</label>
                        <select 
                          value={activeLayerId || ""}
                          onChange={(e) => setActiveLayerId(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {product.customizableParts.map((part) => (
                            <option key={part.id} value={part.id}>
                              {part.label} ({part.id})
                            </option>
                          ))}
                        </select>

                        {activeLayerId && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-800">Color for <span className="text-blue-600">{activeLayerId}</span>:</span>
                              <input 
                                ref={colorInputRef}
                                type="color" 
                                value={layerColors[activeLayerId] || "#FFFFFF"}
                                onChange={(e) => handleColorChange(activeLayerId, e.target.value)}
                                className="h-8 w-14 border border-gray-300 rounded cursor-pointer p-0"
                              />
                            </div>

                            <div className="grid grid-cols-6 gap-2 pt-1">
                              {PRESET_COLORS.map((color, i) => (
                                <button 
                                  key={i}
                                  onClick={() => handleColorChange(activeLayerId, color)}
                                  className={cn(
                                    "w-full aspect-square rounded-full shadow-sm border-2 transition-transform hover:scale-110 flex items-center justify-center relative",
                                    layerColors[activeLayerId] === color ? "border-blue-600 ring-2 ring-blue-600/30" : "border-gray-200"
                                  )}
                                  style={{ backgroundColor: color }}
                                >
                                  {layerColors[activeLayerId] === color && (
                                    <Check className={cn("w-3.5 h-3.5", color === "#FFFFFF" ? "text-black" : "text-white")} />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
                        No parsed layer mappings found for this product. Upload an SVG template with element IDs to enable dynamic layer color editing.
                      </div>
                    )}
                  </div>
                )}

                {/* ELEMENTS TAB */}
                {activeTab === "elements" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-800 text-sm">Custom Graphics & Logos</h3>
                    <p className="text-xs text-gray-500 mb-2">Upload graphics to overlay on the product template.</p>
                    
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="mb-1 text-sm text-gray-600"><span className="font-semibold">Click to upload image</span></p>
                        <p className="text-xs text-gray-400">PNG, JPG, SVG (MAX. 5MB)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                )}

                {/* TEXT TAB */}
                {activeTab === "text" && (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-gray-800 text-sm">Add Custom Text</h3>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Text Content</label>
                        <input 
                          type="text" 
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter text..."
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Text Color</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="h-10 w-16 border border-gray-200 p-0 rounded cursor-pointer"
                          />
                          <Button 
                            className="flex-1 bg-black text-white hover:bg-gray-800"
                            onClick={handleAddText}
                          >
                            <TypeIcon className="w-4 h-4 mr-2" /> Add to Canvas
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bottom Actions */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <Button 
                  className="w-full bg-black hover:bg-gray-900 text-white rounded-lg h-11 text-sm font-bold shadow-md"
                  onClick={handleSaveDesign}
                >
                  <Download className="w-4 h-4 mr-2" /> Export Design Preview
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
