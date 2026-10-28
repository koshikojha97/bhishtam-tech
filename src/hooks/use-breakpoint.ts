"use client";

import { useSyncExternalStore } from "react";

export type Breakpoint = "sm" | "lg" | "xl";

const LG = "(min-width: 1024px)";
const XL = "(min-width: 1280px)";

function subscribe(cb: () => void) {
  const a = window.matchMedia(LG);
  const b = window.matchMedia(XL);
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
}

function snapshot(): Breakpoint {
  if (window.matchMedia(XL).matches) return "xl";
  if (window.matchMedia(LG).matches) return "lg";
  return "sm";
}

/** Current Tailwind breakpoint bucket (mobile / lg tablet / xl desktop) for JS-only chart sizing. */
export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, snapshot, () => "xl");
}
