"use client";

import { useState } from "react";
import { LogoMark } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

interface ResetStep1Props {
  onNext: () => void;
}

export function ResetStep1({ onNext }: ResetStep1Props) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm flex flex-col items-center select-none"
    >
      {/* Brand Logo */}
      <div className="flex flex-col items-center mb-6">
        <LogoMark className="w-16 h-8 text-[#F97316]" />
        <span className="text-[10px] font-heading font-black tracking-[0.3em] text-[#F97316] uppercase mt-1 italic -mr-[0.3em]">
          FOREMOST
        </span>
      </div>

      {/* Title */}
      <h1 className="font-heading text-2xl font-black text-gray-900 mb-1 text-center">
        Enter Your Email
      </h1>
      <p className="text-xs text-gray-500 font-medium mb-8 text-center px-4">
        As will send a verification code to your address.
      </p>

      {/* Form Fields */}
      <div className="w-full flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-bold text-gray-700 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400/80 transition-colors"
          />
        </div>
      </div>

      {/* Send Button */}
      <Button
        type="submit"
        className="w-full mt-6 bg-[#F97316] hover:bg-[#EA580C] text-white py-6 rounded-xl font-bold transition-colors shadow-sm text-xs flex items-center justify-center cursor-pointer border-0"
      >
        Send
      </Button>
    </form>
  );
}
