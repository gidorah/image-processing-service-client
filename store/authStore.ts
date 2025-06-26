import { logoutUser } from "@/lib/api";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuth: (v: boolean) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  setAuth: (v) => set({ isAuthenticated: v }),
  logout: async () => {
    await logoutUser();
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
