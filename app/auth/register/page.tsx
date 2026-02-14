import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | InternshipHub",
  description: "Register to create an account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
