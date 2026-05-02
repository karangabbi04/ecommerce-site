
import { create } from "zustand";
import { Product } from "@/types/product";
import { productService } from "@/services/product.service";

interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: Pagination | null;
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearError: () => void;
}

interface Pagination {
  currentPage: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
   pagination: null,
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async (page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null });

      const data = await productService.getAllProducts(page, limit);

      set({
        products: data.products,
        isLoading: false,
        pagination: data.pagination,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch products",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const product = await productService.getProductById(id);

      set({
        selectedProduct: product,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch product",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));