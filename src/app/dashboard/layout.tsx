import type { Metadata } from "next";
import { Sidebar, SidebarOffset } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PageTransition } from "@/components/shared/motion";
import { BugCursor } from "@/components/site/bug-cursor";

export const metadata: Metadata = {
  // default is itself run through the root template ("%s · Bhishtam Tech"), so no suffix here
  title: { default: "Dashboard", template: "%s · Bhishtam Tech" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root min-h-screen bg-bd-page selection:bg-bd-royal selection:text-white">
      <Sidebar />
      <SidebarOffset>
        <Header />
        <main className="px-[20px] pt-[20px] pb-[30px] lg:px-[25px] lg:pt-[24px] xl:px-[40px] xl:pt-[28px] xl:pb-[40px]">
          <div className="w-full">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </SidebarOffset>
      <BugCursor />
    </div>
  );
}
