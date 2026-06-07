import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

  setUser: (user: User | null) => void;
  setAuthLoading: (value: boolean) => void;
  logoutUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,

  setUser: (user) =>
    set({
      user: user,
      isAuthenticated: Boolean(user),
    }),

  setAuthLoading: (value) =>
    set({
      isAuthLoading: value,
    }),

  logoutUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));