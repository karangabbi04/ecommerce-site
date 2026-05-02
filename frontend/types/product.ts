export interface Product {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  price: number;
  oldPrice?: number;
  image?: string;
  stock: number;
  category?: string;
  createdAt?: string;
}
export interface Pagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}