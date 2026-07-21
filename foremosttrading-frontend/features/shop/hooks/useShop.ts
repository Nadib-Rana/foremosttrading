"use client";

import { useState, useRef, useEffect } from "react";
import { FilterCustomizable, SortOption } from "../types";
import { api } from "@/services/apiService";
import { ITEMS_PER_PAGE } from "../constants";

export function useShop() {
  const [filterCustomizable, setFilterCustomizable] = useState<FilterCustomizable>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState<number>(2); // Start on page 2 to match Figma active bar indicator default state
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch products from backend
  useEffect(() => {
    setIsLoading(true);
    api.getProducts()
      .then(res => {
        const mapped = (res.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          basePrice: Number(p.basePrice),
          salePrice: Number(p.basePrice),
          images: p.images?.map((img: any) => img.url) || ["https://images.unsplash.com/photo-1580087443864-44bfa286377e?w=500"],
          isCustomizable: p.isCustomizable,
          category: p.category?.name || "FOOTBALL",
        }));
        setProducts(mapped);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products from API:", err);
        setIsLoading(false);
      });
  }, []);

  // Filter products
  let filtered = products.filter((product) => {
    if (filterCustomizable === "customizable") {
      return product.isCustomizable;
    }
    return true;
  });

  // Sort products
  if (sortBy === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.salePrice - b.salePrice);
  } else if (sortBy === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.salePrice - a.salePrice);
  }

  // Setup pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (safeCurrentPage < totalPages) {
      setIsLoading(true);
      setCurrentPage(safeCurrentPage + 1);
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  const handlePrevPage = () => {
    if (safeCurrentPage > 1) {
      setIsLoading(true);
      setCurrentPage(safeCurrentPage - 1);
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  const selectFilter = (filter: FilterCustomizable) => {
    setIsLoading(true);
    setFilterCustomizable(filter);
    setCurrentPage(1); // Reset to page 1 on filter change
    setIsFilterDropdownOpen(false);
    setTimeout(() => setIsLoading(false), 600);
  };

  const selectSort = (sort: SortOption) => {
    setIsLoading(true);
    setSortBy(sort);
    setIsSortDropdownOpen(false);
    setTimeout(() => setIsLoading(false), 600);
  };

  const selectPage = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    setTimeout(() => setIsLoading(false), 600);
  };

  return {
    filterCustomizable,
    sortBy,
    currentPage: safeCurrentPage,
    totalPages,
    paginatedProducts,
    isFilterDropdownOpen,
    setIsFilterDropdownOpen,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    filterRef,
    sortRef,
    handleNextPage,
    handlePrevPage,
    setCurrentPage: selectPage,
    selectFilter,
    selectSort,
    isLoading,
  };
}
export type UseShopReturn = ReturnType<typeof useShop>;
