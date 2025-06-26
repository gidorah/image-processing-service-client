import { logoutUser, checkAuthStatus } from "@/lib/api";
import { create } from "zustand";
import { User } from "@/lib/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  setAuth: (v: boolean) => void;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true, // Start with loading state
  setAuth: (v) => set({ isAuthenticated: v }),
  logout: async () => {
    await logoutUser();
    set({ isAuthenticated: false, user: null });
  },
  verifyAuth: async () => {
    try {
      const { data: user } = await checkAuthStatus();
      set({ isAuthenticated: true, user, loading: false });
    } catch {
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },
}));

export default useAuthStore;
