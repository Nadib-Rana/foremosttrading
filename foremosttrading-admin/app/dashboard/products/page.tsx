"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Copy, 
  Trash2, 
  Eye, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Package
} from "lucide-react";
import { mockDb, MockProduct } from "@/services/mockDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [customizableFilter, setCustomizableFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    mockDb.initialize();
    setProducts(mockDb.getProducts());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      mockDb.deleteProduct(id);
      setProducts(mockDb.getProducts());
    }
  };

  const handleDuplicate = (product: MockProduct) => {
    const duplicateProduct = {
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy`,
      category: product.category,
      basePrice: product.basePrice,
      description: product.description,
      images: product.images,
      isCustomizable: product.isCustomizable,
      isActive: product.isActive,
      shapes: product.shapes
    };
    mockDb.saveProduct(duplicateProduct);
    setProducts(mockDb.getProducts());
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    mockDb.updateProduct(id, { isActive: !currentStatus });
    setProducts(mockDb.getProducts());
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.category === categoryFilter;
    const matchesCustomizable = customizableFilter === "ALL" || 
                                (customizableFilter === "CUSTOMIZABLE" && p.isCustomizable) ||
                                (customizableFilter === "STANDARD" && !p.isCustomizable);
    return matchesSearch && matchesCategory && matchesCustomizable;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "price-asc") return a.basePrice - b.basePrice;
    if (sortBy === "price-desc") return b.basePrice - a.basePrice;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  // Paginated products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Manage and customize your catalog models and template configurations.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-primary text-primary-foreground shadow-sm">
            <Plus className="mr-1.5 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 bg-secondary/30"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="h-9 rounded-md border border-input bg-secondary/10 px-3 text-xs font-semibold focus-visible:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="FOOTBALL">Football</option>
              <option value="BASKETBALL">Basketball</option>
              <option value="TENNIS">Tennis</option>
              <option value="ACCESSORIES">Accessories</option>
            </select>
            <select 
              value={customizableFilter}
              onChange={(e) => { setCustomizableFilter(e.target.value); setCurrentPage(1); }}
              className="h-9 rounded-md border border-input bg-secondary/10 px-3 text-xs font-semibold focus-visible:outline-none"
            >
              <option value="ALL">All Layouts</option>
              <option value="CUSTOMIZABLE">Customizable Only</option>
              <option value="STANDARD">Standard Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 items-center">
            <span className="text-xs text-muted-foreground font-medium">Sort:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-md border border-input bg-secondary/10 px-3 text-xs font-semibold focus-visible:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          <div className="flex border border-input rounded-md overflow-hidden shrink-0">
            <Button 
              variant={viewMode === "grid" ? "default" : "ghost"} 
              size="icon" 
              className="h-8 w-8 rounded-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="icon" 
              className="h-8 w-8 rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-border bg-card">
          <CardContent className="flex flex-col items-center gap-3 justify-center">
            <SlidersHorizontal className="h-10 w-10 text-muted-foreground/60" />
            <h3 className="text-base font-bold text-foreground">No products found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">No results match your search and filter criteria. Adjust filters or create a new catalog item.</p>
            <Link href="/dashboard/products/new">
              <Button size="sm" className="mt-2">Create Product</Button>
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        /* Grid Layout */
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedProducts.map((p) => (
            <Card key={p.id} className="overflow-hidden border border-border shadow-sm group bg-card transition-all hover:shadow-md hover:-translate-y-0.5 duration-200">
              <div className="aspect-square w-full relative bg-secondary flex items-center justify-center overflow-hidden border-b border-border">
                {p.images && p.images[0] ? (
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <Package className="h-12 w-12 text-muted-foreground" />
                )}
                {p.isCustomizable && (
                  <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-primary/95 text-primary-foreground px-2 py-0.5 text-[9px] font-bold shadow-sm uppercase tracking-wider">
                    Customizable
                  </span>
                )}
                <span className={`absolute top-2 right-2 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                  p.isActive 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" 
                    : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400"
                }`}>
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-foreground line-clamp-1">{p.name}</h3>
                    <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{p.category.toLowerCase()}</p>
                  </div>
                  <span className="text-xs font-black text-foreground">${p.basePrice.toFixed(2)}</span>
                </div>

                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed min-h-[30px]">
                  {p.description || "No description provided."}
                </p>

                <div className="flex gap-1.5 pt-2 border-t border-border mt-2">
                  {p.isCustomizable && (
                    <Link href={`/dashboard/customizer/${p.id}/editor`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-[10px] font-bold h-8">
                        <Eye className="mr-1 h-3.5 w-3.5" /> Customize
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 border border-border"
                    title="Duplicate"
                    onClick={() => handleDuplicate(p)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 shrink-0 border border-border"
                    title="Delete"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 shrink-0 border border-border ${p.isActive ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                    title={p.isActive ? "Deactivate" : "Activate"}
                    onClick={() => handleToggleActive(p.id, p.isActive)}
                  >
                    {p.isActive ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List Layout */
        <Card className="border border-border shadow-sm overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/20 text-muted-foreground font-semibold">
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Base Price</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Customization</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-secondary border border-border shrink-0">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground m-2.5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{p.name}</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">{p.description}</p>
                      </div>
                    </td>
                    <td className="p-3 capitalize">{p.category.toLowerCase()}</td>
                    <td className="p-3 font-semibold text-foreground">${p.basePrice.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                        p.isActive 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" 
                          : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400"
                      }`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        p.isCustomizable 
                          ? "bg-primary/10 text-primary" 
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}>
                        {p.isCustomizable ? "Customizable" : "Standard"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        {p.isCustomizable && (
                          <Link href={`/dashboard/customizer/${p.id}/editor`}>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] px-2.5">
                              Customize
                            </Button>
                          </Link>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 border border-border"
                          onClick={() => handleDuplicate(p)}
                          title="Duplicate"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-600 border border-border hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          onClick={() => handleDelete(p.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 border border-border text-muted-foreground"
                          onClick={() => handleToggleActive(p.id, p.isActive)}
                          title={p.isActive ? "Deactivate" : "Activate"}
                        >
                          {p.isActive ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground font-semibold">
            Showing Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="h-8 text-xs px-3"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="h-8 text-xs px-3"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
