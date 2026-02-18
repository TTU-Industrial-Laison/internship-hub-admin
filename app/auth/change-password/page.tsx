import { Metadata } from "next";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
  title: "Change Password | InternshipHub",
  description: "Update your password to continue",
};

export default function ChangePasswordPage() {
  return (
    <AuthGuard>
      <ChangePasswordForm />
    </AuthGuard>
  );
}
