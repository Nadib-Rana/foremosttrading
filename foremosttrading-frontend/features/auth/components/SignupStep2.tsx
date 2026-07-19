"use client";

import { useState } from "react";
import { LogoMark } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

interface SignupStep2Props {
  onSubmit: () => void;
}

export function SignupStep2({ onSubmit }: SignupStep2Props) {
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const handleChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, "");
    if (cleanVal.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto focus next input
    if (cleanVal !== "" && index < 4) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm flex flex-col items-center select-none"
    >
      {/* Brand Logo */}
      <div className="flex flex-col items-center mb-6">
        <LogoMark className="w-16 h-8 text-[#EF892A]" />
        <span className="text-[10px] font-heading font-black tracking-[0.3em] text-[#EF892A] uppercase mt-1 italic -mr-[0.3em]">
          FOREMOST
        </span>
      </div>

      {/* Title */}
      <h1 className="font-heading text-2xl font-black text-gray-900 mb-1 text-center">
        Enter Verification Code
      </h1>
      <p className="text-xs text-gray-500 font-medium mb-8 text-center px-4">
        Please enter the verification code sent to your email.
      </p>

      {/* OTP Inputs Group */}
      <div className="flex gap-3 justify-center mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            required
            maxLength={1}
            className="w-12 h-12 rounded-xl border border-gray-200 bg-white text-center font-bold text-gray-800 focus:outline-none focus:border-blue-500 text-sm shadow-2xs transition-colors"
          />
        ))}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#EF892A] hover:bg-[#D97310] text-white py-6 rounded-xl font-bold transition-colors shadow-sm text-xs flex items-center justify-center cursor-pointer border-0"
      >
        Submit
      </Button>

      {/* Resend Link */}
      <button
        type="button"
        onClick={() => alert("Resending verification code...")}
        className="text-xs font-bold text-[#EF892A] hover:underline mt-4 cursor-pointer"
      >
        Resend it
      </button>
    </form>
  );
}
