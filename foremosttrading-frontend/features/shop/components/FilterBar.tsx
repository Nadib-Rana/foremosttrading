"use client";

import { RefObject } from "react";
import { ChevronDown } from "lucide-react";
import { FilterCustomizable, SortOption } from "../types";

interface FilterBarProps {
  filterCustomizable: FilterCustomizable;
  sortBy: SortOption;
  isFilterDropdownOpen: boolean;
  setIsFilterDropdownOpen: (open: boolean) => void;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: (open: boolean) => void;
  filterRef: RefObject<HTMLDivElement | null>;
  sortRef: RefObject<HTMLDivElement | null>;
  selectFilter: (filter: FilterCustomizable) => void;
  selectSort: (sort: SortOption) => void;
}

export function FilterBar({
  filterCustomizable,
  sortBy,
  isFilterDropdownOpen,
  setIsFilterDropdownOpen,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
  filterRef,
  sortRef,
  selectFilter,
  selectSort,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h1 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900">
        All Collection
      </h1>

      <div className="flex items-center gap-3">
        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-xs cursor-pointer select-none"
          >
            <span>{filterCustomizable === "all" ? "Customizable" : "Customizable Only"}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {isFilterDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 animate-in fade-in duration-100">
              <button
                onClick={() => selectFilter("all")}
                className={`w-full text-left px-4 py-2 text-xs font-semibold uppercase transition-colors hover:bg-gray-50 ${
                  filterCustomizable === "all" ? "text-[#EF892A]" : "text-gray-600"
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => selectFilter("customizable")}
                className={`w-full text-left px-4 py-2 text-xs font-semibold uppercase transition-colors hover:bg-gray-50 ${
                  filterCustomizable === "customizable" ? "text-[#EF892A]" : "text-gray-600"
                }`}
              >
                Customizable Only
              </button>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg bg-white text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-xs cursor-pointer select-none"
          >
            <span>
              {sortBy === "newest"
                ? "Newest"
                : sortBy === "price-asc"
                ? "Price: Low to High"
                : "Price: High to Low"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20 animate-in fade-in duration-100">
              <button
                onClick={() => selectSort("newest")}
                className={`w-full text-left px-4 py-2 text-xs font-semibold uppercase transition-colors hover:bg-gray-50 ${
                  sortBy === "newest" ? "text-[#EF892A]" : "text-gray-600"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => selectSort("price-asc")}
                className={`w-full text-left px-4 py-2 text-xs font-semibold uppercase transition-colors hover:bg-gray-50 ${
                  sortBy === "price-asc" ? "text-[#EF892A]" : "text-gray-600"
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => selectSort("price-desc")}
                className={`w-full text-left px-4 py-2 text-xs font-semibold uppercase transition-colors hover:bg-gray-50 ${
                  sortBy === "price-desc" ? "text-[#EF892A]" : "text-gray-600"
                }`}
              >
                Price: High to Low
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
