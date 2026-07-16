"use client";

import { useState } from "react";
import { ResetStep1 } from "@/features/auth/components/ResetStep1";
import { ResetStep2 } from "@/features/auth/components/ResetStep2";
import { ResetStep3 } from "@/features/auth/components/ResetStep3";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleFinish = () => {
    alert("Password reset successfully! Please log in with your new password.");
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-[#F4F5F7] text-gray-900 flex items-center justify-center px-4 py-12">
      {step === 1 && <ResetStep1 onNext={() => setStep(2)} />}
      {step === 2 && <ResetStep2 onSubmit={() => setStep(3)} />}
      {step === 3 && <ResetStep3 onFinish={handleFinish} />}
    </main>
  );
}
