"use client";

import { useState } from "react";
import { useUploadFileMutation } from "@/lib/store/api/uploadApi";
import { useAddProductShapeMutation, useGetProductShapesQuery } from "@/lib/store/api/productApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

export function ProductShapesManager({ productId }: { productId: string }) {
  const [name, setName] = useState<string>("Full Body");
  const [file, setFile] = useState<File | null>(null);
  const [layers, setLayers] = useState<string>(""); // comma-separated layers
  
  const { data: shapesData, isLoading: isLoadingShapes } = useGetProductShapesQuery(productId);
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [addShape, { isLoading: isAdding }] = useAddProductShapeMutation();

  const handleUpload = async () => {
    if (!file) return alert("Please select an SVG file");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to backend
      const uploadRes = await uploadFile(formData).unwrap();
      const svgUrl = uploadRes.data?.url || uploadRes.url; 

      if (!svgUrl) throw new Error("File upload failed to return a URL");

      // Save shape to product
      await addShape({
        productId,
        shapeData: {
          name,
          svgUrl,
          layers: layers.split(",").map(l => l.trim()).filter(Boolean)
        }
      }).unwrap();

      setFile(null);
      setLayers("");
      alert("Shape uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error?.data?.message || "An error occurred");
    }
  };

  const shapes = shapesData?.data?.shapes || shapesData?.shapes || [];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Product Body Shapes (Views)</CardTitle>
        <CardDescription>Upload the SVG views (Front, Back, etc.) for the 2D customizer.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Add New View</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">View Name</label>
                <Select value={name} onValueChange={(val) => val && setName(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select view name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Body">Full Body</SelectItem>
                    <SelectItem value="Full Hand and Body">Full Hand and Body</SelectItem>
                    <SelectItem value="Half Body (Full Hand)">Half Body (Full Hand)</SelectItem>
                    <SelectItem value="Half Body (Half Hand)">Half Body (Half Hand)</SelectItem>
                    <SelectItem value="Legs">Legs</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Customizable Layers (IDs or Names)</label>
                <Input 
                  value={layers}
                  onChange={(e) => setLayers(e.target.value)}
                  placeholder="e.g. Jersey Body, Collar, Left Sleeve"
                />
                <p className="text-xs text-gray-500 mt-1">Comma separated list of customizable parts.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">SVG File</label>
                <Input 
                  type="file" 
                  accept=".svg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <Button 
                onClick={handleUpload}
                disabled={!file || isUploading || isAdding}
                className="w-full"
              >
                {isUploading || isAdding ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Plus className="mr-2 h-4 w-4" /> Add Shape</>
                )}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Uploaded Views</h3>
            {isLoadingShapes ? (
              <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
            ) : shapes.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500">
                No shapes uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {shapes.map((shape: any) => (
                  <div key={shape.id} className="border rounded-lg p-2 relative group flex flex-col items-center">
                    <div className="relative w-full aspect-square bg-gray-50 rounded mb-2 overflow-hidden flex items-center justify-center">
                      <Image 
                        src={shape.svgUrl} 
                        alt={shape.name} 
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <span className="text-sm font-medium">{shape.name}</span>
                    <span className="text-xs text-gray-500">{shape.layers?.length || 0} layers</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
