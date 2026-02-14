import { Suspense } from "react";
import { VerifyOTPForm } from "@/components/auth/verify-otp-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | InternshipHub",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyOTPForm />
    </Suspense>
  );
}
