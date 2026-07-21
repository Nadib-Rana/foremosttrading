"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setUser, setLoading, logout } from "@/lib/store/slices/authSlice";

import { useGetMeQuery } from "@/lib/store/api/authApi";
import { usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAppSelector((state) => state.auth);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, error, isLoading: isFetching } = useGetMeQuery(undefined, {
    skip: !token, // Only fetch if token is present
  });

  useEffect(() => {
    if (!token && pathname !== "/") {
      dispatch(logout());
      router.push("/");
      dispatch(setLoading(false));
    }
  }, [token, pathname, router, dispatch]);

  useEffect(() => {
    if (data && data.data) {
      dispatch(setUser(data.data));
    } else if (data && data.user) {
      dispatch(setUser(data.user));
    }
    
    if (error) {
      console.error("Auth check failed:", error);
      dispatch(logout());
      router.push("/");
    }
  }, [data, error, dispatch, router]);

  if (!isMounted || isFetching || (token && !data && !error)) {
    return (
      <div suppressHydrationWarning className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div suppressHydrationWarning className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  // If not authenticated and not on login page, we are redirecting
  if (!token && pathname !== "/") {
    return null;
  }

  return <>{children}</>;
}
