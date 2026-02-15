import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | InternshipHub",
  description: "Forgot your password? Enter your email to reset it",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
