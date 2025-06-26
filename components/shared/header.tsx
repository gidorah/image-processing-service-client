"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import useAuthStore from "@/store/authStore";

export default function Header() {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={100}
          height={100}
          className="h-10 w-10"
        />
      </Link>
      <div className="flex gap-4">
        {!isAuthenticated && (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Signup</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
