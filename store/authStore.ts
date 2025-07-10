import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasValidatedBiometric: boolean;
  hasValidatedPin: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  setHasValidatedBiometric: (validated: boolean) => void;
  setHasValidatedPin: (validated: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "1",
    name: "Abdullah Fitri",
    accountNumber: "1234567890",
    balance: 15420.5,
    email: "fitri@email.com",
    phone: "+60123456789",
  },
  isAuthenticated: true,
  isLoading: false,
  hasValidatedBiometric: false,
  hasValidatedPin: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateBalance: (newBalance) =>
    set((state) => ({
      user: state.user ? { ...state.user, balance: newBalance } : null,
    })),
  setHasValidatedBiometric: (validated) =>
    set({ hasValidatedBiometric: validated }),
  setHasValidatedPin: (validated) => set({ hasValidatedPin: validated }),
}));

export default useAuthStore;
