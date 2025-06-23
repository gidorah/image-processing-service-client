import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuth: (v: boolean) => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  setAuth: (v) => set({ isAuthenticated: v }),
}));

export default useAuthStore;
