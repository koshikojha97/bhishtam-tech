"use client";

/**
 * Animated bug cursor for the marketing site. Follows the mouse with a slight lag, turns to face
 * the direction of travel, scuttles its legs while moving, twitches its antennae when idle,
 * grows over interactive elements and squishes on press.
 * Mouse + fine pointer only, and off for reduced motion — the static SVG cursor in globals.css
 * covers those cases (and the moment before hydration).
 */
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./gsap";

const INTERACTIVE = 'a, button, [role="button"], summary, label, select';
const TEXT = 'input:not([type="checkbox"], [type="radio"], [type="submit"], [type="button"]), textarea, [contenteditable="true"]';

export function BugCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rotor = el.firstElementChild as HTMLElement;
    const root = document.documentElement;
    root.classList.add("bug-cursor-on");

    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const rTo = gsap.quickTo(rotor, "rotation", { duration: 0.4, ease: "power3.out" });

    let visible = false;
    let last: { x: number; y: number } | null = null;
    let angle = 0;
    let stop = 0;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const { clientX: x, clientY: y } = e;
      if (!visible) {
        gsap.set(el, { x, y });
        gsap.to(el, { opacity: 1, duration: 0.2 });
        visible = true;
      }
      xTo(x);
      yTo(y);
      if (!last) last = { x, y };
      const dx = x - last.x;
      const dy = y - last.y;
      if (dx * dx + dy * dy > 16) {
        // head points up in the SVG, so +90°; take the shortest turn to avoid spinning through 360°
        const target = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        angle += ((((target - angle) % 360) + 540) % 360) - 180;
        rTo(angle);
        last = { x, y };
        el.dataset.moving = "true";
        window.clearTimeout(stop);
        stop = window.setTimeout(() => delete el.dataset.moving, 140);
      }
      const t = e.target as Element | null;
      el.dataset.state = t?.closest(TEXT) ? "text" : t?.closest(INTERACTIVE) ? "hover" : "idle";
    };
    const down = () => (el.dataset.pressed = "true");
    const up = () => delete el.dataset.pressed;
    const leave = () => {
      gsap.to(el, { opacity: 0, duration: 0.2 });
      visible = false;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    root.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.removeEventListener("mouseleave", leave);
      window.clearTimeout(stop);
      root.classList.remove("bug-cursor-on");
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="bug-cursor pointer-events-none fixed top-0 left-0 z-[9999] opacity-0" data-state="idle">
      <div>
        <svg className="bug-skin" width="34" height="34" viewBox="-1 -1 26 26" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* bug glyph adapted from Lucide (ISC), split into parts so legs/antennae can animate */}
          <path className="bug-antenna bug-antenna-l" d="m8 2 1.88 1.88" />
          <path className="bug-antenna bug-antenna-r" d="M14.12 3.88 16 2" />
          <path className="bug-leg bug-leg-l1 bug-gait-a" d="M6.53 9C4.6 8.8 3 7.1 3 5" />
          <path className="bug-leg bug-leg-l2 bug-gait-b" d="M6 13H2" />
          <path className="bug-leg bug-leg-l3 bug-gait-a" d="M3 21c0-2.1 1.7-3.9 3.8-4" />
          <path className="bug-leg bug-leg-r1 bug-gait-b" d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
          <path className="bug-leg bug-leg-r2 bug-gait-a" d="M22 13h-4" />
          <path className="bug-leg bug-leg-r3 bug-gait-b" d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
          <path d="M9 7.13v-1a3 3 0 1 1 6 0v1" />
          <path className="bug-body" d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
          <path d="M12 20v-9" />
        </svg>
      </div>
    </div>
  );
}
