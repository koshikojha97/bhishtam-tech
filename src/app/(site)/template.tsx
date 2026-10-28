"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";

/** Re-mounts on every route change → GSAP page-enter transition (accent wipe + content fade). */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  const wipe = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(wipe.current, { display: "none" });
      return;
    }
    gsap
      .timeline()
      .fromTo(wipe.current, { scaleY: 1, transformOrigin: "top" }, { scaleY: 0, duration: 0.8, ease: "expo.inOut" })
      .from(content.current, { opacity: 0, y: 30, duration: 0.8, ease: "expo.out", clearProps: "all" }, "-=0.45");
  });
  return (
    <>
      <div ref={wipe} aria-hidden className="pointer-events-none fixed inset-0 z-[60] bg-cx-accent" />
      <div ref={content}>{children}</div>
    </>
  );
}
