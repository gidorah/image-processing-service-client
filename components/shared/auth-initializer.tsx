"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthInitializer() {
  useEffect(() => {
    useAuthStore.getState().verifyAuth();
  }, []);

  return null; // Return null to avoid rendering anything
}
