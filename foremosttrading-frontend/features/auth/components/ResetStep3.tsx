"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LogoMark } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

interface ResetStep3Props {
  onFinish: () => void;
}

export function ResetStep3({ onFinish }: ResetStep3Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onFinish();
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
        Enter New Password
      </h1>
      <p className="text-xs text-gray-500 font-medium mb-8 text-center px-4">
        Please create a new password for your account.
      </p>

      {/* Form Fields */}
      <div className="w-full flex flex-col gap-4">
        {/* New Password */}
        <div className="flex flex-col gap-1.5 w-full relative">
          <label className="text-[10px] font-bold text-gray-700 block">
            New password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400/80 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5 w-full relative">
          <label className="text-[10px] font-bold text-gray-700 block">
            Confirm new password
          </label>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter new password"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400/80 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        type="submit"
        className="w-full mt-6 bg-[#EF892A] hover:bg-[#D97310] text-white py-6 rounded-xl font-bold transition-colors shadow-sm text-xs flex items-center justify-center cursor-pointer border-0"
      >
        Confirm
      </Button>
    </form>
  );
}
