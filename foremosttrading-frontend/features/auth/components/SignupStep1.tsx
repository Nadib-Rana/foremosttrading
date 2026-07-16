"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { LogoMark } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

interface SignupStep1Props {
  onNext: () => void;
}

export function SignupStep1({ onNext }: SignupStep1Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+60");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        Create your account
      </h1>
      <p className="text-xs text-gray-500 font-medium mb-8 text-center">
        Join us in just a few simple steps.
      </p>

      {/* Form Fields */}
      <div className="w-full flex flex-col gap-4">
        {/* Name Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 block">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Enter your first name"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400/80 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 block">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Enter your last name"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400/80 transition-colors"
            />
          </div>
        </div>

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

        {/* Phone */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-bold text-gray-700 block">
            Phone
          </label>
          <div className="flex gap-2 w-full">
            <select
              value={phonePrefix}
              onChange={(e) => setPhonePrefix(e.target.value)}
              className="w-20 px-2 py-3 rounded-xl border border-gray-200 bg-white font-bold text-xs text-gray-700 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer text-center"
            >
              <option value="+60">+60</option>
              <option value="+62">+62</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              required
              placeholder="Enter your phone number"
              className="flex-1 rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400/80 transition-colors"
            />
          </div>
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
      </div>

      {/* Forgot Password Link */}
      <div className="w-full flex justify-end mt-2">
        <Link
          href="#"
          className="text-[10px] font-bold text-[#F97316] hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Next Button */}
      <Button
        type="submit"
        className="w-full mt-6 bg-[#F97316] hover:bg-[#EA580C] text-white py-6 rounded-xl font-bold transition-colors shadow-sm text-xs flex items-center justify-center cursor-pointer border-0"
      >
        Next
      </Button>

      {/* Log In Footer */}
      <p className="text-[10px] font-medium text-gray-500 mt-6">
        Already have an account?
        <Link
          href="/login"
          className="text-[#F97316] font-bold hover:underline ml-1"
        >
          log in
        </Link>
      </p>
    </form>
  );
}
