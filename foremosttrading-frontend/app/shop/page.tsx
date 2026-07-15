"use client";

import { useShop } from "@/features/shop/hooks/useShop";
import { Navbar } from "@/components/layout/Navbar";
import { FilterBar } from "@/features/shop/components/FilterBar";
import { ProductGrid } from "@/features/shop/components/ProductGrid";
import { Pagination } from "@/features/shop/components/Pagination";
import { Footer } from "@/components/layout/Footer";

export default function ShopPage() {
  const shop = useShop();

  return (
    <main className="min-h-screen bg-[#F9F9F9] text-gray-900 flex flex-col">
      <Navbar theme="light" />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title and Filter Row */}
        <FilterBar
          filterCustomizable={shop.filterCustomizable}
          sortBy={shop.sortBy}
          isFilterDropdownOpen={shop.isFilterDropdownOpen}
          setIsFilterDropdownOpen={shop.setIsFilterDropdownOpen}
          isSortDropdownOpen={shop.isSortDropdownOpen}
          setIsSortDropdownOpen={shop.setIsSortDropdownOpen}
          filterRef={shop.filterRef}
          sortRef={shop.sortRef}
          selectFilter={shop.selectFilter}
          selectSort={shop.selectSort}
        />

        {/* Product Grid */}
        <ProductGrid products={shop.paginatedProducts} />

        {/* Pagination Row */}
        <Pagination
          currentPage={shop.currentPage}
          totalPages={shop.totalPages}
          onPageChange={shop.setCurrentPage}
          onNextPage={shop.handleNextPage}
          onPrevPage={shop.handlePrevPage}
        />

      </div>

      <Footer />
    </main>
  );
}
