"use client";

import { useState } from "react";
import { SignupStep1 } from "@/features/auth/components/SignupStep1";
import { SignupStep2 } from "@/features/auth/components/SignupStep2";
import { SignupStep3 } from "@/features/auth/components/SignupStep3";
import { api } from "@/services/apiService";

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<any>({});
  const [errorMsg, setErrorMsg] = useState("");

  const handleStep1 = async (data: any) => {
    setErrorMsg("");
    try {
      setFormData(data);
      await api.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phoneNumber,
      });
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Try again.");
    }
  };

  const handleStep2 = async (token: string) => {
    setErrorMsg("");
    try {
      const res = await api.verifyOtp({
        email: formData.email,
        token,
      });
      localStorage.setItem("ft_auth_token", res.accessToken);
      localStorage.setItem("ft_user", JSON.stringify(res.user));
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid or expired OTP token.");
    }
  };

  const handleStep3 = async (profileData: any) => {
    setErrorMsg("");
    try {
      await api.setupProfile({
        dob: profileData.dob,
        gender: profileData.gender,
      });
      alert("Profile set up successfully! Account registration complete.");
      window.location.href = "/account";
    } catch (err: any) {
      setErrorMsg(err.message || "Profile setup failed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F5F7] text-gray-900 flex flex-col items-center justify-center px-4 py-12">
      {errorMsg && (
        <div className="w-full max-w-sm bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-xs font-bold text-center">
          {errorMsg}
        </div>
      )}
      {step === 1 && <SignupStep1 onNext={handleStep1} />}
      {step === 2 && <SignupStep2 onSubmit={handleStep2} />}
      {step === 3 && <SignupStep3 onFinish={handleStep3} />}
    </main>
  );
}
