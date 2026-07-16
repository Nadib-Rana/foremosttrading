"use client";

import { useState, useRef } from "react";
import { UploadCloud, ChevronDown } from "lucide-react";
import { LogoMark } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";

interface SignupStep3Props {
  onFinish: () => void;
}

export function SignupStep3({ onFinish }: SignupStep3Props) {
  const [dob, setDob] = useState("2005-01-10");
  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("221B Baker Street, Marylebone, London NW1 6XE, United Kingdom");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish();
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
        Set up your profile
      </h1>
      <p className="text-xs text-gray-500 font-medium mb-8 text-center px-4">
        Let’s set up your profile in just a few steps.
      </p>

      {/* Image Upload Box */}
      <div className="mb-6 flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div
          onClick={handleUploadClick}
          className="w-24 h-24 rounded-xl border border-dashed border-gray-250 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors p-2 text-center shadow-3xs overflow-hidden"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center text-center">
              <UploadCloud className="w-6 h-6 text-gray-400" />
              <span className="text-[8px] font-bold text-gray-500 uppercase mt-1 leading-tight px-1">
                Click here to upload
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="w-full flex flex-col gap-4">
        {/* DOB & Gender Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* DOB */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 block">
              Date Of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs transition-colors"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 block">
              Gender
            </label>
            <div className="relative w-full">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs appearance-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-bold text-gray-700 block">
            Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400 transition-colors resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Finish Button */}
      <Button
        type="submit"
        className="w-full mt-6 bg-[#F97316] hover:bg-[#EA580C] text-white py-6 rounded-xl font-bold transition-colors shadow-sm text-xs flex items-center justify-center cursor-pointer border-0"
      >
        Finish
      </Button>
    </form>
  );
}
