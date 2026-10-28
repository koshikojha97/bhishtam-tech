"use client";

/**
 * Home V3 hero — Figma `3:783` y 0–1114.
 * Layers: grid mask bg (3:784) · Three.js iso-pulses · text block (3:5862) · isometric art stage
 * (laptop 3:5244, panel 3:5861, screen 3:5888, lock 3:6129, shield 3:6273, gear 3:6439) · divider 3:1885.
 */
import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";
import { Magnetic } from "@/components/site/anim";
import { Container, PrimaryButton, SecondaryButton } from "@/components/site/ui";
import { cn } from "@/lib/utils";

const IsoPulses = dynamic(() => import("@/components/site/three/iso-pulses"), { ssr: false, loading: () => null });

/**
 * Art units, positioned in "stage" coordinates = Figma frame coords − (610.6, 141).
 * The laptop + back panel + screen UI move as ONE unit (they must stay registered); props float freely.
 */
type Img = { src: string; x: number; y: number; w: number; h: number };
const UNITS: { key: string; depth: number; float: number; imgs: Img[] }[] = [
  {
    key: "device",
    depth: 12,
    float: 7,
    imgs: [
      { src: "/site/home/hero-laptop.webp", x: 34.3, y: 0, w: 795.5, h: 867.5 },
      { src: "/site/home/hero-panel.webp", x: 373, y: 25, w: 456.5, h: 615.5 },
      { src: "/site/home/hero-screen.webp", x: 382.4, y: 74.9, w: 423, h: 570 },
    ],
  },
  { key: "lock", depth: 38, float: 16, imgs: [{ src: "/site/home/hero-lock.webp", x: 109.3, y: 194.6, w: 144.5, h: 257 }] },
  { key: "shield", depth: 50, float: 14, imgs: [{ src: "/site/home/hero-shield.webp", x: 509.5, y: 296.1, w: 128, h: 215 }] },
  { key: "gear", depth: 30, float: 12, imgs: [{ src: "/site/home/hero-gear.webp", x: 0, y: 714.9, w: 300.5, h: 180 }] },
];

const AVATARS = ["/site/home/avatar-1.webp", "/site/home/avatar-2.webp", "/site/home/avatar-3.webp"];

function Stat({ value, suffix, label, icon }: { value: number; suffix: string; label: string; icon: string }) {
  return (
    <div data-hero-stat className="flex flex-col items-start">
      <p className="font-geist text-[52px] leading-[1.15] font-medium whitespace-nowrap text-white md:text-[72px]">
        <span data-count={value}>{value}</span>
        <span className="text-cx-accent">{suffix}</span>
      </p>
      <div className="flex items-center gap-[6px]">
        <Image src={icon} alt="" width={24} height={24} className="size-[24px]" />
        <p className="font-geist text-[16px] leading-[1.25] font-medium whitespace-nowrap text-cx-muted md:text-[18px]">{label}</p>
      </div>
    </div>
  );
}

export function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);

      // ── entrance ───────────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.45, defaults: { ease: "expo.out" } });
      tl.from(q("[data-hero-avatar]"), { scale: 0.4, x: -14, opacity: 0, duration: 0.9, stagger: 0.09, ease: "back.out(2)" }, 0)
        .from(q("[data-hero-trusted]"), { x: -16, opacity: 0, duration: 1 }, 0.2)
        .from(q("[data-hero-fade]"), { y: 28, opacity: 0, duration: 1.1, stagger: 0.12 }, 0.65)
        .from(q("[data-hero-stat]"), { y: 36, opacity: 0, duration: 1.1, stagger: 0.16 }, 0.95);

      // staggered counters
      q("[data-count]").forEach((node, i) => {
        const target = Number((node as HTMLElement).dataset.count);
        const o = { v: 0 };
        node.textContent = "0";
        tl.to(o, { v: target, duration: 2, ease: "power2.out", onUpdate: () => (node.textContent = String(Math.round(o.v))) }, 1 + i * 0.25);
      });

      // art: laptop rises, screen boots up, props drop in
      const art = (k: string) => q(`[data-art="${k}"]`);
      tl.from(art("hero-laptop"), { y: 90, scale: 0.9, opacity: 0, duration: 1.6, transformOrigin: "50% 80%" }, 0.1)
        .from(art("hero-panel"), { y: 50, opacity: 0, duration: 1.2 }, 0.45)
        .from(art("hero-screen"), { y: 70, x: 20, opacity: 0, duration: 1.3 }, 0.6)
        .from(art("hero-screen"), { filter: "brightness(2.2)", duration: 0.9, ease: "power2.out", clearProps: "filter" }, 1.1)
        .from(art("hero-lock"), { y: -140, rotate: -10, opacity: 0, duration: 1.2, ease: "back.out(1.5)" }, 0.85)
        .from(art("hero-shield"), { scale: 0.3, opacity: 0, duration: 1.1, ease: "back.out(2.2)", transformOrigin: "50% 60%" }, 1.05)
        .from(art("hero-gear"), { y: 60, x: -40, rotate: -25, opacity: 0, duration: 1.3, ease: "back.out(1.4)" }, 0.95);

      // ── idle float ─────────────────────────────────────────────
      q("[data-float]").forEach((f, i) => {
        const amp = Number((f as HTMLElement).dataset.float);
        gsap.to(f, { y: -amp, duration: 2.8 + i * 0.35, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 + i * 0.15 });
      });

      // ── scroll parallax ───────────────────────────────────────
      gsap.to(q("[data-stage]"), { yPercent: 9, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 } });
      gsap.to(q("[data-hero-text]"), { y: -70, opacity: 0.35, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 } });

      // ── pointer tilt / depth parallax (hover devices only) ───
      if (!contextSafe || !window.matchMedia("(hover: hover)").matches) return;
      const stage = q("[data-stage-tilt]")[0] as HTMLElement | undefined;
      if (!stage) return;
      const rx = gsap.quickTo(stage, "rotationX", { duration: 1.2, ease: "power3.out" });
      const ry = gsap.quickTo(stage, "rotationY", { duration: 1.2, ease: "power3.out" });
      const layers = q("[data-depth]").map((d) => ({
        depth: Number((d as HTMLElement).dataset.depth),
        x: gsap.quickTo(d, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(d, "y", { duration: 1.1, ease: "power3.out" }),
      }));
      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / Math.min(r.height, window.innerHeight) - 0.5;
        ry(nx * 7);
        rx(-ny * 5);
        layers.forEach((l) => {
          l.x(nx * l.depth);
          l.y(ny * l.depth * 0.7);
        });
      });
      const leave = contextSafe(() => {
        rx(0);
        ry(0);
        layers.forEach((l) => {
          l.x(0);
          l.y(0);
        });
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Intro" className="relative isolate overflow-hidden bg-cx-bg pb-[64px] xl:h-[1114px] xl:pb-0">
      {/* grid mask background (Figma 3:784, starts at y 46) */}
      <Image
        src="/site/home/hero-grid.webp"
        alt=""
        width={1440}
        height={1068}
        priority
        className="pointer-events-none absolute top-[46px] left-0 -z-20 h-[1068px] w-full max-w-none object-cover object-top select-none"
      />
      {/* Three.js: light pulses running along the isometric grid */}
      <IsoPulses className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1114px]" />

      <Container className="relative z-10 pt-[120px] md:pt-[150px] xl:pt-[171px]">
        <div data-hero-text className="flex w-full max-w-[552px] flex-col">
          <div className="flex items-center gap-[16px]">
            <div className="flex items-center">
              {AVATARS.map((src, i) => (
                <span key={src} data-hero-avatar className={cn("relative size-[48px] shrink-0 overflow-hidden rounded-full bg-cx-accent", i < 2 && "mr-[-10px]")} style={{ zIndex: 3 - i }}>
                  <Image src={src} alt="" width={48} height={48} className="size-full" priority />
                </span>
              ))}
            </div>
            <p data-hero-trusted className="font-geist text-[16px] leading-[1.25] font-medium whitespace-nowrap text-cx-muted md:text-[18px]">
              Trusted by <span className="text-white">150M+</span> users
            </p>
          </div>

          {/* Figma's hero heading (3:5871) is a single space — kept blank (72px / 83px line) to match the design.
              A screen-reader-only h1 keeps the page accessible/SEO-friendly. Put real copy here if you want a visible heading. */}
          <h1 className="sr-only">Bhishtam Tech — security experts on all technologies &amp; platforms</h1>
          <div aria-hidden className="hidden pt-[24px] xl:block">
            <div className="h-[83px]" />
          </div>

          <p data-hero-fade className="pt-[16px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">
            Lorem ipsum dolor sit amet consectetur sagittis amet placerat elementum ornare eget amet massa egestas adipiscing est.
          </p>

          <div data-hero-fade className="flex flex-wrap items-center gap-[16px] pt-[24px]">
            <Magnetic strength={0.25}>
              <PrimaryButton href="/contact">Get in touch</PrimaryButton>
            </Magnetic>
            <SecondaryButton href="/about" className="px-0">
              Learn more
            </SecondaryButton>
          </div>

          <div className="mt-[48px] flex flex-wrap gap-x-[40px] gap-y-[24px] md:mt-[80px] xl:mt-[209px]">
            <Stat value={575} suffix="+" label="Successful Projects" icon="/site/home/icon-check.svg" />
            <Stat value={99} suffix="%" label="Customer satisfaction" icon="/site/home/icon-person.svg" />
          </div>
        </div>
      </Container>

      {/* isometric art stage (Figma x 610.6 → 1440, y 141 → 1036) */}
      <div
        data-stage
        aria-hidden
        className="pointer-events-none relative mx-auto mt-[40px] h-[895px] w-[829.4px] [zoom:0.4] min-[420px]:[zoom:0.48] md:mt-[56px] md:[zoom:0.84] xl:absolute xl:top-[141px] xl:right-0 xl:mx-0 xl:mt-0 xl:[zoom:1]"
      >
        <div data-stage-tilt className="relative size-full [transform-style:preserve-3d] [transform:perspective(1600px)]">
          {UNITS.map((u, ui) => (
            <div key={u.key} data-depth={u.depth} className="absolute inset-0 will-change-transform">
              <div data-float={u.float} className="absolute inset-0 will-change-transform">
                {u.imgs.map((im) => {
                  const name = im.src.split("/").pop()!.replace(".webp", "");
                  return (
                    <Image
                      key={im.src}
                      data-art={name}
                      src={im.src}
                      alt=""
                      width={Math.round(im.w)}
                      height={Math.round(im.h)}
                      priority={ui === 0}
                      draggable={false}
                      className="absolute max-w-none select-none"
                      style={{ left: im.x, top: im.y, width: im.w, height: im.h }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* divider (Figma 3:1885 at y 1114) */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-cx-line" />
    </section>
  );
}
