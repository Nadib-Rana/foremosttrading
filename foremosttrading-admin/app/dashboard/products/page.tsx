import Link from "next/link";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// Basic component to list products and a button to add a new one.
export default async function ProductsPage() {
  
  // We can fetch products here, but for now just showing UI and a link
  let products = [];
  try {
    const res = await fetch("http://localhost:3030/admin/products", { cache: 'no-store' });
    if(res.ok) {
      const json = await res.json();
      products = json.data?.products || [];
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/products/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        {products.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No products found. Click "Add Product" to create one.
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Customize</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {products.map((p: any) => (
                  <tr key={p.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{p.name}</td>
                    <td className="p-4 align-middle">{p.category}</td>
                    <td className="p-4 align-middle">${p.basePrice}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-center">
                      {p.isCustomizable ? (
                        <Link href={`/dashboard/customizer`}>
                          <Button variant="outline" size="sm" className="text-primary border-primary">
                            Customize
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
