import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <AuthShell title="Create your account" subtitle="Join Bhishtam Tech and manage your projects, security and account in one place.">
      <SignupForm />
    </AuthShell>
  );
}
