import { ProductForm } from "@/components/products/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
      </div>

      <div className="rounded-md border bg-card p-6 shadow-sm max-w-3xl">
        <ProductForm />
      </div>
    </div>
  );
}
