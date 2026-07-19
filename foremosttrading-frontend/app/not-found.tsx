import Link from "next/link";
import { MoveLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F4F5F7] flex flex-col items-center justify-center px-6 py-24 select-none">
      <div className="text-center max-w-md w-full">
        {/* Giant visual header */}
        <h1 className="font-heading text-8xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#EF892A] to-[#D97310] drop-shadow-xs">
          404
        </h1>

        {/* Title Case header */}
        <h2 className="font-heading text-2xl md:text-3xl font-black text-gray-900 mt-6 tracking-tight">
          Page Not Found
        </h2>

        <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-4 px-2">
          We can’t seem to find the page you’re looking for. It may have been moved, deleted, or never existed in the first place.
        </p>

        {/* Buttons Action Group */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 items-stretch justify-center px-4">
          <Button
            className="bg-[#EF892A] hover:bg-[#D97310] text-white py-5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border-0 shadow-sm"
            render={<Link href="/" />}
            nativeButton={false}
          >
            <MoveLeft className="w-4 h-4" />
            Go back home
          </Button>

          <Button
            variant="outline"
            className="border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
            render={<Link href="/shop" />}
            nativeButton={false}
          >
            <ShoppingBag className="w-4 h-4 text-gray-500" />
            Visit shop
          </Button>
        </div>
      </div>
    </main>
  );
}
