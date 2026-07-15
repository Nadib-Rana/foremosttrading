"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPrevPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-6">
      {/* Dots/Indicators (matches screenshot dot, bar, dot design) */}
      <div className="flex items-center gap-1.5">
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          const isActive = currentPage === pageNum;
          return (
            <button
              key={i}
              onClick={() => onPageChange(pageNum)}
              className={`transition-all duration-300 cursor-pointer ${
                isActive
                  ? "h-2 w-8 bg-[#F97316] rounded-full"
                  : "h-2 w-2 bg-gray-300 hover:bg-gray-400 rounded-full"
              }`}
              aria-label={`Go to page ${pageNum}`}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={onPrevPage}
          className="border-gray-200 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none rounded-lg px-4 py-2 flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="bg-[#F97316] hover:bg-[#EA580C] text-white disabled:opacity-50 disabled:pointer-events-none rounded-lg px-4 py-2 flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-sm select-none"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
