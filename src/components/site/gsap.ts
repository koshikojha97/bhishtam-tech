"use client";

/**
 * Single place that registers GSAP plugins for the marketing site.
 * Import { gsap, ScrollTrigger, SplitText, useGSAP } from here — never from "gsap" directly —
 * so plugins are always registered exactly once (client-only).
 *
 * Play-once reveals: use `toggleActions: "play none none none"`, NOT `once: true`. A `once`
 * trigger kills itself during refresh when the page loads already scrolled past it, which
 * shrinks ScrollTrigger's internal list mid-loop and throws "reading 'end'" (gsap 3.15).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
