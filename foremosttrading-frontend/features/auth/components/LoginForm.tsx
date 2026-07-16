"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { LogoMark } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logging in as: ${email}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm flex flex-col items-center select-none"
    >
      {/* Centralized Logo */}
      <div className="flex flex-col items-center mb-6">
        <LogoMark className="w-16 h-8 text-[#F97316]" />
        <span className="text-[10px] font-heading font-black tracking-[0.3em] text-[#F97316] uppercase mt-1 italic -mr-[0.3em]">
          FOREMOST
        </span>
      </div>

      {/* Headings */}
      <h1 className="font-heading text-2xl font-black text-gray-900 mb-1 text-center">
        Welcome back
      </h1>
      <p className="text-xs text-gray-500 font-medium mb-8 text-center">
        Log in to your account
      </p>

      {/* Inputs Container */}
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
            className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400/80 placeholder:font-medium transition-colors"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 w-full relative">
          <label className="text-[10px] font-bold text-gray-700 block">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400/80 placeholder:font-medium transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className="w-full flex justify-end mt-2">
        <Link
          href="/forgot-password"
          className="text-[10px] font-bold text-[#F97316] hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Log In Button */}
      <Button
        type="submit"
        className="w-full mt-6 bg-[#F97316] hover:bg-[#EA580C] text-white py-6 rounded-xl font-bold transition-colors shadow-sm text-xs flex items-center justify-center cursor-pointer border-0"
      >
        Log In
      </Button>

      {/* Sign Up Footer */}
      <p className="text-[10px] font-medium text-gray-500 mt-6">
        Don’t have an account?
        <Link
          href="/signup"
          className="text-[#F97316] font-bold hover:underline ml-1"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
