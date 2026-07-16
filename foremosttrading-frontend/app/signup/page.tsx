"use client";

import { useState } from "react";
import { SignupStep1 } from "@/features/auth/components/SignupStep1";
import { SignupStep2 } from "@/features/auth/components/SignupStep2";
import { SignupStep3 } from "@/features/auth/components/SignupStep3";

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleFinish = () => {
    alert("Profile set up successfully! Account registration complete.");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-[#F4F5F7] text-gray-900 flex items-center justify-center px-4 py-12">
      {step === 1 && <SignupStep1 onNext={() => setStep(2)} />}
      {step === 2 && <SignupStep2 onSubmit={() => setStep(3)} />}
      {step === 3 && <SignupStep3 onFinish={handleFinish} />}
    </main>
  );
}
