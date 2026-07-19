import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="w-full py-8 md:py-12 bg-[#F4F5F7]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="w-full bg-[#111] rounded-[24px] p-8 md:p-16 flex flex-col items-start justify-center text-white">
          <p className="text-gray-400 text-xs md:text-sm tracking-widest font-bold uppercase mb-4">
            FOR TEAMS &bull; FOR SCHOOLS &bull; FOR BRANDS
          </p>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-tight mb-4">
            Outfit the whole roster.
          </h2>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mb-8">
            Volume pricing, dedicated production manager, name & number sheets.
            Submit a bulk inquiry and we'll quote within 24 hours.
          </p>
          <Button
            className="bg-[#EF892A] hover:bg-[#D97310] text-white font-bold px-8 h-12 text-base rounded-md border-0 cursor-pointer flex items-center justify-center"
            render={<Link href="/teams-and-bulk" />}
            nativeButton={false}
          >
            Request bulk quote &gt;
          </Button>
        </div>
      </div>
    </section>
  );
}
