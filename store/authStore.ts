import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: () => boolean;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearTokens: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: () => !!get().accessToken,
      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
