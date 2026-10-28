import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Bhishtam Tech", template: "%s · Bhishtam Tech" },
};

/** Auth pages share the marketing-site look; the chrome lives in components/auth/auth-shell. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
