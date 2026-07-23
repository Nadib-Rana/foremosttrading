"use client";

import { useState } from "react";
import { Plus, Trash2, FolderTree, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/lib/store/api/categoryApi";

export default function CategoriesPage() {
  const { data: categoriesData, isLoading, refetch } = useGetCategoriesQuery(undefined);
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      setError("Name and slug are required.");
      return;
    }
    try {
      await createCategory({ name, slug, description }).unwrap();
      setName("");
      setSlug("");
      setDescription("");
      setError("");
      refetch();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create category");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete category:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground">Classify catalog products to organize designer canvas selections.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Add Category Form */}
        <Card className="border border-border shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-2.5 bg-rose-50 text-rose-800 rounded border border-rose-200 text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="cat-name" className="text-xs font-semibold">Category Name</Label>
                <Input 
                  id="cat-name" 
                  placeholder="e.g. Compression Gear" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cat-slug" className="text-xs font-semibold">URL Slug</Label>
                <Input 
                  id="cat-slug" 
                  placeholder="compression-gear" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cat-desc" className="text-xs font-semibold">Description</Label>
                <Textarea 
                  id="cat-desc" 
                  placeholder="Details concerning sizing guidelines or template shapes for this class..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm" className="w-full text-xs font-semibold h-9">
                <Plus className="mr-1.5 h-4.5 w-4.5" /> Save Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories Grid List */}
        <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <Card key={c.id} className="border border-border shadow-sm bg-card hover:shadow-md transition-shadow relative">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FolderTree className="h-4.5 w-4.5" />
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground">{c.name}</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">{c.description || "No description provided."}</p>
                <div className="flex justify-between items-center text-[10px] pt-2 border-t border-border">
                  <span className="font-mono text-muted-foreground uppercase">slug: {c.slug}</span>
                  <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">{c.productCount} products</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
