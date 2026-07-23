"use client";

import { useState, useRef, useEffect } from "react";
import { FilterCustomizable, SortOption, Product } from "../types";
import { api } from "@/services/apiService";
import { ITEMS_PER_PAGE } from "../constants";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1580087443864-44bfa286377e?w=500&auto=format&fit=crop&q=80";

// In-memory catalog cache for instant 0ms rendering
let cachedProducts: Product[] | null = null;

export function useShop() {
  const [filterCustomizable, setFilterCustomizable] = useState<FilterCustomizable>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(!cachedProducts);
  const [products, setProducts] = useState<Product[]>(cachedProducts || []);

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

  // Fetch products from backend instantly with background SWR cache
  useEffect(() => {
    if (!cachedProducts) {
      setIsLoading(true);
    }

    api.getProducts()
      .then(res => {
        const rawList = Array.isArray(res) ? res : (res?.products || res?.data || []);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

        const mapped: Product[] = rawList.map((p: any) => {
          let mainImage: string | null = null;

          if (p.images && p.images.length > 0) {
            const rawUrl = p.images[0].imageUrl || p.images[0].url || (typeof p.images[0] === "string" ? p.images[0] : null);
            if (rawUrl && typeof rawUrl === "string") {
              const str = rawUrl.trim();
              if (str.startsWith("http://") || str.startsWith("https://") || str.startsWith("data:")) {
                mainImage = str;
              } else {
                const clean = str.startsWith("/") ? str : `/${str}`;
                mainImage = `${baseUrl}${clean}`;
              }
            }
          }

          if (!mainImage && p.template?.svgFile?.views?.[0]?.svgUrl) {
            const rawUrl = p.template.svgFile.views[0].svgUrl;
            if (rawUrl && typeof rawUrl === "string") {
              const str = rawUrl.trim();
              if (str.startsWith("http://") || str.startsWith("https://") || str.startsWith("data:")) {
                mainImage = str;
              } else {
                const clean = str.startsWith("/") ? str : `/${str}`;
                mainImage = `${baseUrl}${clean}`;
              }
            }
          }

          // Check if image URL is invalid test string
          if (!mainImage || mainImage.endsWith(";") || !/\.(png|jpg|jpeg|webp|svg|gif)(\?.*)?$/i.test(mainImage)) {
            if (!mainImage?.includes("unsplash.com") && !mainImage?.startsWith("data:image/")) {
              mainImage = FALLBACK_IMAGE;
            }
          }

          const basePriceNum = Number(p.basePrice) || 50;

          return {
            id: p.id,
            title: p.name || "Custom Kit",
            description: p.description || "Premium customizable kit with high-performance breathable fabric.",
            originalPrice: Math.round(basePriceNum * 1.2),
            salePrice: basePriceNum,
            image: mainImage,
            isSale: true,
            isCustomizable: p.isCustomizable !== false,
          };
        });

        cachedProducts = mapped;
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
      setCurrentPage(safeCurrentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    }
  };

  const selectFilter = (filter: FilterCustomizable) => {
    setFilterCustomizable(filter);
    setCurrentPage(1);
    setIsFilterDropdownOpen(false);
  };

  const selectSort = (sort: SortOption) => {
    setSortBy(sort);
    setIsSortDropdownOpen(false);
  };

  const selectPage = (page: number) => {
    setCurrentPage(page);
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
