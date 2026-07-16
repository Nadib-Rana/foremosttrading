"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BulkInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Jerseys");
  const [requirements, setRequirements] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${name}! Inquiry submitted successfully. Our designer will reach out shortly.`);
    // Reset form
    setName("");
    setEmail("");
    setTeamName("");
    setPhone("");
    setRequirements("");
    setFileName(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col gap-5 select-none"
    >
      <div className="pb-3 border-b border-gray-50">
        <h3 className="font-heading text-lg font-black text-gray-900 uppercase">
          Request Team Proposal
        </h3>
      </div>

      <div className="w-full flex flex-col gap-4">
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 block">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Team Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 block">Team / Organization</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              placeholder="e.g. Marylebone FC"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-700 block">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter your phone number"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-bold text-gray-700 block">Design Guidelines & Details</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            required
            rows={3}
            placeholder="Share requirements like collar types, sleeve colors, custom rosters, and branding layouts..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-xs font-bold text-gray-800 focus:outline-none focus:border-blue-500 shadow-2xs placeholder:text-gray-400 resize-none leading-relaxed"
          />
        </div>

        {/* Logo upload */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[10px] font-bold text-gray-700 block">Attach Team Logo (Optional)</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.svg,.pdf"
            className="hidden"
          />
          <div
            onClick={handleUploadClick}
            className="w-full rounded-xl border border-dashed border-gray-250 bg-white py-4 px-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#F97316] transition-colors gap-2"
          >
            {fileName ? (
              <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Uploaded: {fileName}</span>
              </div>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase leading-none">
                  Click here to attach design vectors
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-4 bg-[#F97316] hover:bg-[#EA580C] text-white py-6 rounded-xl font-bold transition-colors shadow-sm text-xs flex items-center justify-center cursor-pointer border-0"
      >
        Submit Inquiry
      </Button>
    </form>
  );
}
