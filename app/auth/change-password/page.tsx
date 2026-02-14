import { Metadata } from "next";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export const metadata: Metadata = {
  title: "Change Password | InternshipHub",
  description: "Update your password to continue",
};

export default function ChangePasswordPage() {
  return <ChangePasswordForm />;
}
