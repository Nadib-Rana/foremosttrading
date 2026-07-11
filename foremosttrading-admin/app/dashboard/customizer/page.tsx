import Link from "next/link";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CustomizerPage() {
  let products = [];
  try {
    const res = await fetch("http://localhost:3030/admin/products", { cache: 'no-store' });
    if(res.ok) {
      const json = await res.json();
      products = (json.data?.products || []).filter((p: any) => p.isCustomizable);
    }
  } catch (err) {
    console.error("Failed to fetch products for customizer:", err);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customizer Management</h2>
      </div>
      
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        {products.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No customizable products found. Create one from the Products tab.
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {products.map((p: any) => (
                  <tr key={p.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{p.name}</td>
                    <td className="p-4 align-middle">{p.category}</td>
                    <td className="p-4 align-middle text-right space-x-2">
                      <Link href={`/dashboard/customizer/${p.id}`}>
                        <Button variant="outline" size="sm">
                          <Layers className="mr-2 h-4 w-4" /> Manage Shapes
                        </Button>
                      </Link>
                      <Link href={`/dashboard/customizer/${p.id}/editor`}>
                        <Button variant="default" size="sm">
                          Start Customization
                        </Button>
                      </Link>
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
