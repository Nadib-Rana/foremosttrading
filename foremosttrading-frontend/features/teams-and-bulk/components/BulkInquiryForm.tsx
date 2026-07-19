"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BulkInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [phone, setPhone] = useState("");
  const [requirements, setRequirements] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      // Simulate API submit latency of 1500ms
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      // Reset form fields
      setName("");
      setEmail("");
      setTeamName("");
      setPhone("");
      setRequirements("");
      setFileName(null);
    } catch {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
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
            className="w-full rounded-xl border border-dashed border-gray-250 bg-white py-4 px-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#EF892A] transition-colors gap-2"
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

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex gap-3 items-start text-xs select-none">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Inquiry Sent Successfully</h4>
            <p className="mt-1 font-semibold leading-relaxed text-gray-600">
              Thank you! Our dedicated account manager will review your specs and reach out with design mockups and pricing options within 24 hours.
            </p>
          </div>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex gap-3 items-start text-xs select-none">
          <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Submission Failed</h4>
            <p className="mt-1 font-semibold leading-relaxed text-gray-600">
              Something went wrong while sending your inquiry. Please check your network connection and try again.
            </p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-4 bg-[#EF892A] hover:bg-[#D97310] text-white py-6 rounded-xl font-bold transition-all shadow-sm text-xs flex items-center justify-center cursor-pointer border-0 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          "Submit Inquiry"
        )}
      </Button>
    </form>
  );
}
