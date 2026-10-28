"use client";

/**
 * Full-screen splash for the first load of any page. Server-rendered, so it covers the page from the
 * first paint (animations are CSS, no JS needed); fades out once the window has loaded, fonts are
 * ready and a short minimum has passed, then unmounts. Client-side navigations don't show it again
 * (the root layout persists) — those use the route-level <RouteLoader />.
 */
import { useEffect, useState } from "react";
import { LoaderMark } from "./loader";
import { cn } from "@/lib/utils";

const MIN_MS = 900; // from navigation start, so fast loads still read as intentional
const MAX_MS = 4000; // never block the page longer than this

const MESSAGES = ["Initializing secure session", "Encrypting connection", "Scanning for threats"];

export function PageSplash() {
  const [state, setState] = useState<"show" | "hide" | "gone">("show");

  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const min = new Promise((r) => setTimeout(r, Math.max(0, (reduced ? 200 : MIN_MS) - performance.now())));
    const loaded = document.readyState === "complete" ? Promise.resolve() : new Promise((r) => window.addEventListener("load", r, { once: true }));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const cap = new Promise((r) => setTimeout(r, MAX_MS));
    void Promise.race([Promise.all([min, loaded, fonts]), cap]).then(() => {
      if (!cancelled) setState("hide");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Bhishtam Tech"
      aria-hidden={state === "hide" || undefined}
      onTransitionEnd={(e) => e.target === e.currentTarget && state === "hide" && setState("gone")}
      className={cn("splash", state === "hide" && "splash-hide")}
    >
      <div className="flex flex-col items-center">
        <LoaderMark size={120} />
        <p className="mt-[34px] font-michroma text-[15px] tracking-[0.32em] text-white md:text-[17px]">BHISHTAM TECH</p>
        <div className="mt-[18px] flex h-[20px] w-[290px] items-center justify-center gap-[8px] font-geist text-[12px] text-cx-muted md:text-[13px]">
          <span className="text-cx-accent">{">"}</span>
          <span className="splash-msgs">
            {MESSAGES.map((m, i) => (
              <span key={m} style={{ animationDelay: `${i * 1.2}s` }}>
                {m}
              </span>
            ))}
          </span>
          <span className="splash-caret" aria-hidden>
            _
          </span>
        </div>
        <span className="splash-bar mt-[16px]" aria-hidden>
          <span />
        </span>
      </div>
    </div>
  );
}
