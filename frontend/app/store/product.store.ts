"use client";
import { create } from "zustand";
import { Product } from "@/types/product";
import { productService } from "@/services/product.service";

interface ProductStore {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });

      const products = await productService.getAllProducts();

      set({
        products,
        isLoading: false,
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