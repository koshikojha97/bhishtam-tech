import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { NotFoundView } from "@/components/site/misc/not-found-view";

export const metadata: Metadata = { title: { absolute: "404 not found · Bhishtam Tech" } };

/** Global not-found (Figma "404 not found" 3:9168). Renders outside the (site) layout, so it mounts the site chrome itself. */
export default function NotFound() {
  return (
    <div className="site-root min-h-screen overflow-x-clip bg-cx-bg font-geist text-white antialiased selection:bg-cx-accent selection:text-white">
      <SiteHeader />
      <main>
        <NotFoundView />
      </main>
      <SiteFooter />
    </div>
  );
}
