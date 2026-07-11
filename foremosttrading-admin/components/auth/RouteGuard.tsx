"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // We assume isLoading starts true and becomes false once we verify auth.
    // However, if we rely on localStorage initialized synchronously in authSlice,
    // isLoading might be true or false depending on how it's set.
    // For now, if we are not authenticated and trying to access a protected route, redirect to login.
    if (!isLoading && !isAuthenticated && pathname !== "/") {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not authenticated and not on login page, we are redirecting, return null to avoid flash
  if (!isAuthenticated && pathname !== "/") {
    return null;
  }

  return <>{children}</>;
}
