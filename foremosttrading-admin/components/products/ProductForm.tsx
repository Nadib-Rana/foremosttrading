"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddProductMutation } from "@/lib/store/api/productApi";
import { useUploadFileMutation } from "@/lib/store/api/uploadApi";

export function ProductForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();

  const [uploadFile] = useUploadFileMutation();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadFile(formData).unwrap();
        return res.data?.url || res.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(Boolean) as string[];
      
      setImageUrls((prev) => [...prev, ...validUrls]);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to upload one or more images");
    } finally {
      setIsUploading(false);
      // Reset input value to allow uploading the same file again if needed
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name")?.toString(),
      slug: formData.get("slug")?.toString(),
      category: formData.get("category")?.toString(),
      basePrice: parseFloat(formData.get("basePrice")?.toString() || "0"),
      description: formData.get("description")?.toString() || "",
      images: imageUrls,
      isCustomizable: formData.get("isCustomizable") === "on",
      isActive: formData.get("isActive") === "on",
    };

    try {
      const res = await addProduct(productData).unwrap();
      router.push(`/dashboard/products`);
    } catch (err: any) {
      console.error(err);
      setError(err?.data?.message || "Failed to create product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 py-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" required placeholder="e.g., Authentic Home Jersey" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" required placeholder="e.g., authentic-home-jersey" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select 
            id="category" 
            name="category" 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="FOOTBALL">Football</option>
            <option value="BASKETBALL">Basketball</option>
            <option value="TENNIS">Tennis</option>
            <option value="ACCESSORIES">Accessories</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="basePrice">Base Price</Label>
          <Input id="basePrice" name="basePrice" type="number" step="0.01" required placeholder="99.99" />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Product details..." />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Product Images</Label>
          <div className="flex items-center gap-4">
            <Input type="file" accept="image/*" multiple onChange={handleFileUpload} disabled={isUploading} />
            {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>
          {imageUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-green-600 mb-2">{imageUrls.length} image(s) uploaded successfully!</p>
              <div className="flex flex-wrap gap-4">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group border rounded p-1">
                    <img src={url} alt={`Preview ${idx + 1}`} className="h-32 w-32 object-contain" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                    <input type="hidden" name="images[]" value={url} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 flex items-center gap-2">
          <input type="checkbox" id="isCustomizable" name="isCustomizable" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <Label htmlFor="isCustomizable" className="mt-0">Is Customizable?</Label>
        </div>

        <div className="space-y-2 flex items-center gap-2">
          <input type="checkbox" id="isActive" name="isActive" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <Label htmlFor="isActive" className="mt-0">Active / Visible</Label>
        </div>

      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isUploading || isAdding} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
          {isAdding ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
