import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { BugCursor } from "@/components/site/bug-cursor";

export const metadata: Metadata = {
  title: { default: "Bhishtam Tech", template: "%s · Bhishtam Tech" },
  description: "Bhishtam Tech — security experts on all technologies & platforms.",
};

/** Public marketing site (Figma "Cybersecurity X"). Always dark, independent of the dashboard theme toggle. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root min-h-screen overflow-x-clip bg-cx-bg font-geist text-white antialiased selection:bg-cx-accent selection:text-white">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <BugCursor />
    </div>
  );
}
