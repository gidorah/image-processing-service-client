"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return null;
  }

  return (
    !isAuthenticated && (
      <div className="flex flex-col items-center justify-center gap-[32px]">
        <main className="flex flex-col items-center justify-center gap-[32px]">
          <h1 className="text-4xl font-bold">Image Processing Service</h1>
          <p className="text-lg">
            This is the front-end of image processing service toy project of
            mine.
          </p>
          <p className="text-lg">
            It is a simple service that allows you to upload an image and
            process it.
          </p>
        </main>
      </div>
    )
  );
}
