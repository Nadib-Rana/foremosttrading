"use client";

import { useEffect, useState, useRef } from "react";
import { Save, ChevronDown, Camera, Loader2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/apiService";

export function PersonalInfoForm() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getMe()
      .then(user => {
        const first = user.firstName || user.customer?.firstName || "";
        const last = user.lastName || user.customer?.lastName || "";
        const computedName = (first || last) ? `${first} ${last}`.trim() : (user.fullName || user.email?.split("@")[0] || "");

        setName(computedName);
        setEmail(user.email || "");
        setPhone(user.customer?.phone || user.customer?.phoneNumber || "");

        const customerObj = user.customer;
        const profileObj = customerObj?.profile || customerObj;

        if (profileObj?.dob || customerObj?.dob) {
          const rawDob = profileObj?.dob || customerObj?.dob;
          try {
            setDob(new Date(rawDob).toISOString().split("T")[0]);
          } catch (e) {
            setDob(String(rawDob).split("T")[0]);
          }
        }

        setGender(profileObj?.gender || customerObj?.gender || "Male");

        const rawImg = user.profileImageUrl || user.avatarUrl || profileObj?.avatarUrl || customerObj?.profileImageUrl;
        if (rawImg && !rawImg.includes("unsplash.com")) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
          let finalUrl = rawImg;
          if (!rawImg.startsWith("http://") && !rawImg.startsWith("https://") && !rawImg.startsWith("data:")) {
            const clean = rawImg.startsWith("/") ? rawImg : `/${rawImg}`;
            finalUrl = `${baseUrl}${clean}`;
          }
          setAvatarUrl(finalUrl);
        }

        if (profileObj?.address || customerObj?.address) {
          setAddress(profileObj?.address || customerObj?.address || "");
        } else {
          // Fetch primary address as fallback
          api.getAddresses()
            .then(addrs => {
              if (addrs && addrs.length > 0) {
                const addr = addrs[0];
                setAddress(`${addr.street || ""}, ${addr.city || ""}, ${addr.state || ""} ${addr.postalCode || ""}, ${addr.country || ""}`.replace(/^,\s*/, ""));
              }
            })
            .catch(console.error);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load user profile:", err);
        setLoading(false);
      });
  }, []);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const uploadedUrl = await api.uploadFile(file);
      if (uploadedUrl) {
        setAvatarUrl(uploadedUrl);
        await api.setupProfile({ profileImageUrl: uploadedUrl });
      }
    } catch (err: any) {
      alert("Failed to upload profile picture: " + (err.message || "Upload error"));
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.setupProfile({
        dob: dob || undefined,
        gender: gender || undefined,
        address: address || undefined,
        profileImageUrl: avatarUrl || undefined,
      });
      alert("Changes saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile details");
    }
  };

  const getUserInitials = (n: string) => {
    if (!n) return "U";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
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

      {/* Profile Avatar Upload Section */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative group">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFileChange}
            className="hidden"
          />

          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name} profile avatar`}
              className="w-24 h-24 rounded-2xl object-cover shadow-3xs border border-gray-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#EF892A] to-[#D97310] flex items-center justify-center text-white font-heading font-black text-2xl shadow-3xs border border-gray-100">
              {getUserInitials(name)}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
            title="Change Profile Picture"
          >
            {uploadingAvatar ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="text-xs font-bold border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 h-8 px-3 rounded-lg"
          >
            {uploadingAvatar ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-gray-500" />
            )}
            {uploadingAvatar ? "Uploading..." : "Upload Photo"}
          </Button>
          <span className="text-[10px] text-gray-400 font-medium">
            Allowed JPG, PNG or WEBP (Max 5MB)
          </span>
        </div>
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
          className="bg-[#EF892A] hover:bg-[#D97310] text-white py-6 px-8 rounded-xl font-bold transition-colors shadow-sm text-xs flex items-center gap-2 cursor-pointer border-0 w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

    </form>
  );
}
