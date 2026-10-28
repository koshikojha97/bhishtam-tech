"use client";

/**
 * GSAP animation primitives for the marketing site.
 * Every primitive: runs on scroll via ScrollTrigger, cleans up via useGSAP scope,
 * and is skipped (content shown instantly) under prefers-reduced-motion.
 *
 *  <Reveal>          fade/slide a block in; children with [data-reveal] stagger
 *  <SplitReveal>     SplitText line/word mask-reveal for headings (keeps inner <span> colours)
 *  <CountUp>         number counter on scroll ("575+", "99%")
 *  <Parallax>        scroll-scrubbed y / rotate / scale
 *  <Float>           idle floating loop for illustrations
 *  <Magnetic>        pointer-follow hover for buttons
 *  <DrawLine>        scaleX line draw on scroll
 */
import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from "./gsap";
import { cn } from "@/lib/utils";

type Tag = keyof React.JSX.IntrinsicElements;

export function Reveal({
  as = "div",
  children,
  className,
  y = 40,
  x = 0,
  delay = 0,
  stagger = 0.12,
  start = "top 85%",
  scale = 1,
  blur = false,
  ...rest
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  y?: number;
  x?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  scale?: number;
  blur?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
      const targets = items.length ? items : [el];
      gsap.from(targets, {
        y,
        x,
        scale,
        opacity: 0,
        filter: blur ? "blur(10px)" : undefined,
        duration: 1,
        delay,
        stagger,
        clearProps: "filter,transform",
        scrollTrigger: { trigger: el, start, toggleActions: "play none none none" },
      });
    },
    { scope: ref },
  );
  const Comp = as as React.ElementType;
  return (
    <Comp ref={ref} className={className} {...rest}>
      {children}
    </Comp>
  );
}

export function SplitReveal({
  as = "h2",
  children,
  className,
  type = "lines",
  delay = 0,
  start = "top 85%",
  immediate = false,
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  type?: "lines" | "words" | "chars";
  delay?: number;
  start?: string;
  /** play on mount instead of on scroll (use for hero headings) */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      let split: SplitText | null = null;
      // wait for fonts so line breaks are measured with the site fonts
      const run = () => {
        split = SplitText.create(el, {
          type: type === "chars" ? "words,chars" : type === "words" ? "words" : "lines",
          mask: type === "lines" ? "lines" : undefined,
          linesClass: "split-line",
        });
        const targets = type === "chars" ? split.chars : type === "words" ? split.words : split.lines;
        gsap.from(targets, {
          yPercent: type === "lines" ? 110 : 60,
          opacity: type === "lines" ? 1 : 0,
          rotate: type === "chars" ? 8 : 0,
          duration: type === "chars" ? 0.7 : 1.1,
          stagger: type === "chars" ? 0.015 : type === "words" ? 0.05 : 0.12,
          ease: "expo.out",
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start, toggleActions: "play none none none" },
        });
      };
      if (document.fonts?.status === "loaded") run();
      else document.fonts?.ready.then(run);
      return () => split?.revert();
    },
    { scope: ref },
  );
  const Comp = as as React.ElementType;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}

export function CountUp({ value, suffix = "", prefix = "", className, duration = 2 }: { value: number; suffix?: string; prefix?: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.textContent = `${prefix}${value}${suffix}`;
        return;
      }
      const o = { v: 0 };
      gsap.to(o, {
        v: value,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(o.v)}${suffix}`;
        },
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

export function Parallax({
  children,
  className,
  y = -80,
  rotate = 0,
  scale,
  start = "top bottom",
  end = "bottom top",
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  rotate?: number;
  scale?: [number, number];
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { y: -y / 2, rotate: -rotate / 2, scale: scale?.[0] },
        { y: y / 2, rotate: rotate / 2, scale: scale?.[1], ease: "none", scrollTrigger: { trigger: el, start, end, scrub: 1 } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

export function Float({ children, className, y = 14, duration = 3.2, delay = 0, rotate = 0 }: { children: React.ReactNode; className?: string; y?: number; duration?: number; delay?: number; rotate?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.to(ref.current, { y: -y, rotate, duration, delay, ease: "sine.inOut", yoyo: true, repeat: -1 });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

export function Magnetic({ children, className, strength = 0.35 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || !contextSafe) return;
      if (!window.matchMedia("(hover: hover)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      const leave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("inline-flex", className)}>
      {children}
    </div>
  );
}

export function DrawLine({ className, origin = "left" }: { className?: string; origin?: "left" | "center" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.from(ref.current, { scaleX: 0, transformOrigin: origin, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" } });
    },
    { scope: ref },
  );
  return <div ref={ref} className={cn("h-px w-full bg-cx-line", className)} />;
}

/** Call after layout-changing client updates (images loaded, tabs switched). */
export const refreshScroll = () => ScrollTrigger.refresh();
