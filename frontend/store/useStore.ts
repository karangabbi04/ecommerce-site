import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user: any) => set({ user }),

      cart: [],
      addToCart: (item: any) =>
        set((state: any) => ({
          cart: [...state.cart, item],
        })),
    }),
    {
      name: "app-storage",
    }
  )
);