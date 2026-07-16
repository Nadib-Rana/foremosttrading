"use client";

import { useState } from "react";
import { Save, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PersonalInfoForm() {
  const [name, setName] = useState("Rodro Khan");
  const [dob, setDob] = useState("2005-01-20");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("+620-12345678");
  const [email, setEmail] = useState("abcd1234@gmail.com");
  const [address, setAddress] = useState("221B Baker Street, Marylebone, London NW1 6XE, United Kingdom");

  const avatarUrl =
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Changes saved successfully!");
  };

  return (
    <form
      onSubmit={handleSave}
      className="flex-1 bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col select-none"
    >
      {/* Title */}
      <h2 className="font-heading text-lg font-black text-gray-900 mb-4 pb-4 border-b border-gray-100">
        Personal Information
      </h2>

      {/* Large Image Preview */}
      <div className="mb-6">
        <img
          src={avatarUrl}
          alt="Rodro Khan avatar edit preview"
          className="w-24 h-24 rounded-2xl object-cover shadow-3xs border border-gray-50"
        />
      </div>

      {/* Input Fields Container */}
      <div className="w-full flex flex-col gap-4">
        {/* Name & DOB Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Name */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] font-bold text-gray-700 block">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400"
            />
          </div>

          {/* DOB */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] font-bold text-gray-700 block">
              Date Of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Gender & Phone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Gender */}
          <div className="flex flex-col gap-1.5 w-full">
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

          {/* Phone */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] font-bold text-gray-700 block">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400"
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
            className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400"
          />
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
            className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          className="bg-[#F97316] hover:bg-[#EA580C] text-white py-6 px-8 rounded-xl font-bold transition-colors shadow-sm text-xs flex items-center gap-2 cursor-pointer border-0 w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

    </form>
  );
}
