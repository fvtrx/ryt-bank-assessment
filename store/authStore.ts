import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const useAuthStore = create<AuthState>((set) => ({
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
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateBalance: (newBalance) =>
    set((state) => ({
      user: state.user ? { ...state.user, balance: newBalance } : null,
    })),
}));

export default useAuthStore;
