"use client";

import { LogOut, Menu, User } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Topbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-gray-900 dark:border-gray-800">
      <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-300">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden dark:bg-gray-700" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-4">
            <span className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline-block">
                {user ? user.fullName || user.email : "Admin User"}
              </span>
            </span>

            <div onClick={handleLogout}>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
