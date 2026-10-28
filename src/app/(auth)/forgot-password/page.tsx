import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordFlow } from "@/components/auth/forgot-password-flow";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot password?" subtitle="Enter your email and we'll send you a code to reset your password.">
      <ForgotPasswordFlow />
    </AuthShell>
  );
}
