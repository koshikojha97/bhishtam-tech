import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { PageSplash } from "@/components/shared/page-splash";

export const metadata: Metadata = {
  title: { default: "Bhishtam Tech", template: "%s · Bhishtam Tech" },
  description: "Bhishtam Tech — cybersecurity services and security operations dashboard",
};

const VIEWPORT_SCALE = `(function(){var d=document.documentElement;function f(){var w=window.innerWidth;d.style.zoom=(w>=1280&&w<1440)?String(w/1440):"";}f();window.addEventListener("resize",f);})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fluid desktop scaling: the Figma desktop frame is 1440px wide. Between 1280px and 1439px the
            whole UI is scaled down proportionally (CSS zoom) so laptops (1280/1366) see the exact 1440 layout. */}
        <script dangerouslySetInnerHTML={{ __html: VIEWPORT_SCALE }} />
      </head>
      <body>
        <PageSplash />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
