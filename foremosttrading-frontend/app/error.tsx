"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime Exception:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#F4F5F7] flex flex-col items-center justify-center px-6 py-24 select-none">
      <div className="text-center max-w-md w-full flex flex-col items-center">
        {/* Warning Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-red-55/10 border border-red-200 flex items-center justify-center text-red-500 mb-6 shadow-3xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        {/* Title Case header */}
        <h1 className="font-heading text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          Something went wrong
        </h1>

        <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-4 px-4">
          An unexpected error occurred while loading this page. Please try refreshing or contact support if the issue persists.
        </p>

        {/* Buttons Action Group */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 items-stretch justify-center w-full px-4">
          <Button
            onClick={reset}
            className="flex-1 bg-[#EF892A] hover:bg-[#D97310] text-white py-5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border-0 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </Button>

          <Button
            variant="outline"
            className="flex-1 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
            render={<Link href="/" />}
            nativeButton={false}
          >
            <Home className="w-4 h-4 text-gray-500" />
            Go back home
          </Button>
        </div>

        {/* Collapsible Error Debug Context */}
        <div className="w-full px-4 mt-8">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors mx-auto cursor-pointer"
          >
            {showDetails ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            {showDetails ? "Hide error logs" : "Show error logs"}
          </button>

          {showDetails && (
            <div className="mt-4 text-left bg-gray-55/80 border border-gray-150 rounded-xl p-4 overflow-x-auto text-[10px] font-mono text-gray-600 max-h-40 leading-relaxed shadow-3xs">
              <p className="font-bold text-red-600 mb-1">
                Message: {error.message || "Unknown runtime exception."}
              </p>
              {error.digest && (
                <p className="mt-1 text-gray-500 font-semibold">
                  Digest ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
