"use client";

import { useState } from "react";
import { MockProduct, MockTemplate } from "@/services/mockDb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Settings2, 
  Layers, 
  Palette, 
  Eye, 
  Check, 
  AlertCircle,
  FileCode,
  DollarSign
} from "lucide-react";

interface StepProps {
  formData: any;
  onChange: (fields: Partial<any>) => void;
  templates: MockTemplate[];
}

// STEP 1: Basic Information
export function BasicInfoStep({ formData, onChange }: Omit<StepProps, 'templates'>) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b pb-2 border-border">1. Basic Details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="wiz-name" className="text-xs font-semibold">Product Name</Label>
          <Input 
            id="wiz-name"
            placeholder="e.g. Pro-Jersey Football Kit"
            value={formData.name || ""}
            onChange={(e) => onChange({ name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wiz-slug" className="text-xs font-semibold">URL Slug</Label>
          <Input 
            id="wiz-slug" 
            placeholder="pro-jersey-football-kit"
            value={formData.slug || ""}
            onChange={(e) => onChange({ slug: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wiz-category" className="text-xs font-semibold">Category</Label>
          <select 
            id="wiz-category" 
            value={formData.category || "FOOTBALL"}
            onChange={(e) => onChange({ category: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none"
          >
            <option value="FOOTBALL">Football</option>
            <option value="BASKETBALL">Basketball</option>
            <option value="TENNIS">Tennis</option>
            <option value="ACCESSORIES">Accessories</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wiz-price" className="text-xs font-semibold">Base Price ($)</Label>
          <Input 
            id="wiz-price"
            type="number"
            step="0.01"
            placeholder="149.99"
            value={formData.basePrice || ""}
            onChange={(e) => onChange({ basePrice: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="wiz-desc" className="text-xs font-semibold">Description</Label>
          <Textarea 
            id="wiz-desc" 
            placeholder="Detailed description of physical fabrics, comfort parameters, and design layers..."
            value={formData.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

// STEP 2: Product Images
export function ImagesStep({ formData, onChange }: Omit<StepProps, 'templates'>) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";

    setUploading(true);
    setUploadError("");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const formPayload = new FormData();
      formPayload.append("file", file);

      const res = await fetch(`${API_BASE_URL}/upload/admin/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Do NOT set Content-Type — browser sets it automatically with boundary for multipart
        },
        body: formPayload,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      const uploadedUrl: string = data?.data?.url ?? data?.url;

      if (!uploadedUrl) throw new Error("No URL returned from upload API");

      onChange({ images: [...(formData.images || []), uploadedUrl] });
    } catch (err: any) {
      setUploadError(err?.message || "Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImg = (idx: number) => {
    onChange({ images: formData.images.filter((_: any, i: number) => i !== idx) });
    setUploadError("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b pb-2 border-border">2. Design Mockups</h3>
      <div className="space-y-3">
        <Label className="text-xs font-semibold">Product Images Gallery</Label>
        <div className="flex flex-wrap gap-3">
          {(formData.images || []).map((imgUrl: string, idx: number) => (
            <div key={idx} className="relative h-20 w-20 rounded-lg border border-border bg-secondary overflow-hidden group">
              <img src={imgUrl} alt="Preview" className="h-full w-full object-cover" />
              <button 
                type="button" 
                onClick={() => removeImg(idx)}
                className="absolute inset-0 bg-red-600/90 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            </div>
          ))}

          {/* Hidden file input */}
          <input
            type="file"
            id="img-upload-input"
            accept="image/png,image/jpeg,image/webp,image/gif"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Add Image trigger button */}
          <button
            type="button"
            disabled={uploading}
            onClick={() => document.getElementById("img-upload-input")?.click()}
            className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="text-[9px] font-semibold animate-pulse">Uploading…</span>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span className="text-[9px] font-semibold mt-1">Add Image</span>
              </>
            )}
          </button>
        </div>

        {uploadError && (
          <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" /> {uploadError}
          </p>
        )}

        <p className="text-[10px] text-muted-foreground">
          Select a product image (PNG, JPG, WebP). Images are uploaded to the server and linked to this product.
        </p>
      </div>
    </div>
  );
}

// STEP 3: Select Template
export function TemplateStep({ formData, onChange, templates }: StepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b pb-2 border-border">3. Fabric Template</h3>
      <div className="grid gap-3 grid-cols-2">
        {templates.map((temp) => (
          <div 
            key={temp.id}
            onClick={() => onChange({ templateId: temp.id, tempName: temp.name })}
            className={`border p-3.5 rounded-lg cursor-pointer transition-all ${
              formData.templateId === temp.id 
                ? "border-primary bg-primary/5 ring-1 ring-primary" 
                : "border-border bg-card hover:border-muted-foreground/40"
            }`}
          >
            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <h4 className="text-xs font-bold text-foreground line-clamp-1">{temp.name}</h4>
            <span className="text-[9px] text-muted-foreground uppercase">{temp.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// STEP 4: Upload SVG Layout
export function SvgUploadStep({ formData, onChange }: Omit<StepProps, 'templates'>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSvgSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setLoading(true);
    setError("");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const body = new FormData();
      body.append("file", file);

      const res = await fetch(`${API_BASE_URL}/upload/uploads/svg`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // Unwrap NestJS standard error shape: { data: { message } } or { message }
        const msg = err?.data?.message ?? err?.message ?? `Upload failed (${res.status})`;
        throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
      }

      const json = await res.json();
      // Unwrap ResponseStandardizationInterceptor envelope: { data: { uploadId, svgUrl, layers, metadata } }
      const payload = json?.data ?? json;

      if (!payload?.uploadId) throw new Error("No uploadId returned from backend.");
      if (!payload?.layers) throw new Error("No layers returned from backend.");

      onChange({
        svgUploaded: true,
        svgName: file.name,
        svgUrl: payload.svgUrl,
        uploadId: payload.uploadId,
        layers: (payload.layers as any[]).map((l: any) => ({
          // Normalise backend layer fields to the display format LayerMappingStep expects
          elementId: l.elementId,
          name: l.layerName,
          type: l.layerType.charAt(0) + l.layerType.slice(1).toLowerCase(), // FILL→Fill
          defaultColor: l.defaultColor ?? "#FFFFFF",
          parentGroupId: l.parentGroupId ?? null,
          visible: true,
          locked: false,
          editable: true,
          required: l.layerType !== "GROUP",
        })),
      });
    } catch (err: any) {
      setError(err?.message || "SVG upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b pb-2 border-border">4. Customization Vectors</h3>
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-secondary/10 flex flex-col items-center justify-center gap-3">
        <FileCode className="h-10 w-10 text-muted-foreground/60" />
        {formData.svgUploaded ? (
          <div>
            <h4 className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
              <Check className="h-4 w-4" /> SVG Uploaded &amp; Parsed
            </h4>
            <p className="text-[10px] text-muted-foreground mt-1">
              Backend detected <span className="font-semibold">{formData.layers?.length ?? 0}</span> layers in <span className="font-semibold">{formData.svgName}</span>.
            </p>
          </div>
        ) : (
          <div>
            <h4 className="text-xs font-bold text-foreground">Import customizable SVG mapping</h4>
            <p className="text-[10px] text-muted-foreground mt-1">Files should be structured with explicit color group IDs and paths.</p>
          </div>
        )}

        <input
          type="file"
          id="svg-upload-input"
          accept=".svg,image/svg+xml"
          style={{ display: "none" }}
          onChange={handleSvgSelect}
        />

        <Button
          type="button"
          variant={formData.svgUploaded ? "outline" : "default"}
          size="sm"
          className="mt-2 text-xs h-8"
          disabled={loading}
          onClick={() => document.getElementById("svg-upload-input")?.click()}
        >
          {loading ? "Uploading & Parsing…" : formData.svgUploaded ? "Re-upload SVG" : "Select SVG File"}
        </Button>

        {error && (
          <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" /> {error}
          </p>
        )}
      </div>
    </div>
  );
}

// STEP 5: Layer Mapping
export function LayerMappingStep({ formData, onChange }: Omit<StepProps, 'templates'>) {
  const toggleLayerField = (idx: number, field: string) => {
    const updatedLayers = formData.layers.map((l: any, i: number) => {
      if (i === idx) {
        return { ...l, [field]: !l[field] };
      }
      return l;
    });
    onChange({ layers: updatedLayers });
  };

  const handleColorChange = (idx: number, color: string) => {
    const updatedLayers = formData.layers.map((l: any, i: number) => {
      if (i === idx) {
        return { ...l, defaultColor: color };
      }
      return l;
    });
    onChange({ layers: updatedLayers });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b pb-2 border-border">5. Vector Layer Rules</h3>
      {!formData.svgUploaded ? (
        <div className="p-6 border border-dashed rounded-lg text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <span>Please upload an SVG file in Step 4 first to enable layer mapping.</span>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg bg-card">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b bg-secondary/35 text-muted-foreground font-semibold">
                <th className="p-2.5">Layer Name</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Default Color</th>
                <th className="p-2.5 text-center">Editable</th>
                <th className="p-2.5 text-center">Required</th>
                <th className="p-2.5 text-center">Locked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(formData.layers || []).map((layer: any, idx: number) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="p-2 font-bold text-foreground">{layer.name}</td>
                  <td className="p-2 text-muted-foreground">{layer.type}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={layer.defaultColor} 
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        className="w-5 h-5 rounded border border-border cursor-pointer p-0 bg-transparent"
                      />
                      <span className="font-mono text-[9px] uppercase">{layer.defaultColor}</span>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <input 
                      type="checkbox" 
                      checked={layer.editable} 
                      onChange={() => toggleLayerField(idx, 'editable')}
                      className="h-3.5 w-3.5 rounded border-border"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input 
                      type="checkbox" 
                      checked={layer.required} 
                      onChange={() => toggleLayerField(idx, 'required')}
                      className="h-3.5 w-3.5 rounded border-border"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input 
                      type="checkbox" 
                      checked={layer.locked} 
                      onChange={() => toggleLayerField(idx, 'locked')}
                      className="h-3.5 w-3.5 rounded border-border"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// STEP 6: Customization Configuration
export function ConfigStep({ formData, onChange }: Omit<StepProps, 'templates'>) {
  const defaultColors = ["#FF3B30", "#FF9500", "#FFCC00", "#4CD964", "#007AFF", "#000000", "#FFFFFF"];
  
  const handleColorToggle = (color: string) => {
    const activeColors = formData.allowedColors || defaultColors;
    const isAllowed = activeColors.includes(color);
    const updatedColors = isAllowed 
      ? activeColors.filter((c: string) => c !== color) 
      : [...activeColors, color];
    onChange({ allowedColors: updatedColors });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b pb-2 border-border">6. Platform Options</h3>
      
      <div className="space-y-4">
        {/* Colors Palette Allowed */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Allowed Customizer Palette</Label>
          <div className="flex flex-wrap gap-2">
            {defaultColors.map((color) => {
              const isAllowed = (formData.allowedColors || defaultColors).includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={`w-7 h-7 rounded-full border relative flex items-center justify-center transition-transform ${
                    isAllowed ? "scale-110 ring-2 ring-primary/45 border-white" : "border-border opacity-50"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {isAllowed && <Check className={`h-3 w-3 ${color === '#FFFFFF' ? 'text-black' : 'text-white'}`} />}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground">Select color chips that users can apply to customizable elements.</p>
        </div>

        {/* Text Rules */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="wiz-font" className="text-xs font-semibold">Default Font Family</Label>
            <select 
              id="wiz-font"
              value={formData.defaultFont || "Impact"}
              onChange={(e) => onChange({ defaultFont: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none"
            >
              <option value="Impact">Impact (Athletic)</option>
              <option value="Arial">Arial Bold</option>
              <option value="Courier New">Retro Block</option>
              <option value="Georgia">Classic Serif</option>
            </select>
          </div>
          <div className="space-y-1.5 flex flex-col justify-end pb-1.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.allowLogos !== false} 
                onChange={(e) => onChange({ allowLogos: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-xs font-semibold text-foreground">Allow User Logo Uploads</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// STEP 7: Pricing Rules
export function PricingStep({ formData, onChange }: Omit<StepProps, 'templates'>) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b pb-2 border-border">7. Value Configuration</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="wiz-text-up" className="text-xs font-semibold">Custom Text Upcharge ($)</Label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              id="wiz-text-up" 
              type="number"
              placeholder="10.00"
              value={formData.textUpcharge || ""}
              onChange={(e) => onChange({ textUpcharge: parseFloat(e.target.value) || 0 })}
              className="pl-7"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wiz-logo-up" className="text-xs font-semibold">Custom Logo Upcharge ($)</Label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              id="wiz-logo-up" 
              type="number"
              placeholder="15.00"
              value={formData.logoUpcharge || ""}
              onChange={(e) => onChange({ logoUpcharge: parseFloat(e.target.value) || 0 })}
              className="pl-7"
            />
          </div>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="wiz-bulk" className="text-xs font-semibold">Bulk Discount Rate (%)</Label>
          <Input 
            id="wiz-bulk" 
            type="number"
            placeholder="15% discount for 10+ items"
            value={formData.bulkDiscount || ""}
            onChange={(e) => onChange({ bulkDiscount: parseInt(e.target.value) || 0 })}
          />
          <span className="text-[10px] text-muted-foreground mt-1 block">Specify markdown discount applied for team roster/bulk orders.</span>
        </div>
      </div>
    </div>
  );
}

// STEP 8: Preview Product Model
export function PreviewStep({ formData }: Omit<StepProps, 'templates'>) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b pb-2 border-border">8. Mock Render</h3>
      <div className="flex flex-col items-center gap-4 bg-secondary/15 p-6 rounded-xl border border-border">
        <div className="relative h-48 w-48 rounded-lg overflow-hidden border bg-white flex items-center justify-center">
          {formData.images && formData.images[0] ? (
            <img src={formData.images[0]} alt="Mockup" className="h-full w-full object-cover" />
          ) : (
            <Palette className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
        <div className="text-center">
          <h4 className="text-sm font-bold text-foreground">{formData.name || "Unnamed Product"}</h4>
          <p className="text-xs text-muted-foreground uppercase">{formData.category || "Football"}</p>
          <div className="text-xs font-black text-primary mt-1">${formData.basePrice || "0.00"} Base</div>
        </div>
      </div>
    </div>
  );
}

// STEP 9: Publish Catalog Product
export function PublishStep({ formData, onChange }: Omit<StepProps, 'templates'>) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b pb-2 border-border">9. Publish Model</h3>
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 space-y-1">
          <h4 className="text-xs font-bold flex items-center gap-1.5"><Check className="h-4.5 w-4.5" /> Validation Passed</h4>
          <p className="text-[10px]">Your product layers, configuration, and base pricing structures conform to the customizer specifications.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.isActive !== false} 
              onChange={(e) => onChange({ isActive: e.target.checked })}
              className="h-4.5 w-4.5 rounded border-border text-primary"
            />
            <div>
              <span className="text-xs font-bold block text-foreground">Make Active Immediately</span>
              <span className="text-[10px] text-muted-foreground">Product will appear on client customization portals.</span>
            </div>
          </label>
          <label className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.isCustomizable !== false} 
              onChange={(e) => onChange({ isCustomizable: e.target.checked })}
              className="h-4.5 w-4.5 rounded border-border text-primary"
            />
            <div>
              <span className="text-xs font-bold block text-foreground">Allow Layer Personalization</span>
              <span className="text-[10px] text-muted-foreground">Launch using the customization canvas modules.</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

