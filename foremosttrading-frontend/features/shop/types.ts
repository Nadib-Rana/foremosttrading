export interface Product {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  isSale?: boolean;
  isCustomizable?: boolean;
}

export type FilterCustomizable = "all" | "customizable";

export type SortOption = "newest" | "price-asc" | "price-desc";
