"use client";

/**
 * Home — CTA "Start protecting your online presence" (Figma 3:2334, 1189×640 card).
 * Layers (bg grid, server, screen, lock) are separate 2x exports so they can animate independently:
 * staggered isometric assembly on enter, idle-floating lock with pulsing glow, pointer parallax
 * and a cursor spotlight on the card.
 */
import Image from "next/image";
import { useRef } from "react";
import { A, Container, PrimaryButton, SectionTag } from "@/components/site/ui";
import { Magnetic, SplitReveal } from "@/components/site/anim";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";
import { H2, P, place } from "./shared";

// Art box = union of the illustration layers, anchored to the card's top-right corner (Figma px).
const AW = 567.8;
const AH = 622.7;

function Diamond({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg width="143" height="83" viewBox="0 0 143 83" fill="none" aria-hidden className={className} style={style}>
      <g opacity="0.3">
        <rect width="81.4367" height="81.4367" transform="matrix(0.866025 0.5 -0.866025 0.5 71.3923 0.5)" stroke="#9C9C9C" />
        <rect width="48.84" height="48.84" transform="matrix(0.866025 0.5 -0.866025 0.5 71.3923 33.0967)" stroke="#9C9C9C" strokeDasharray="4 4" />
        <path d="M71.5563 0.5L71.5563 33.0967" stroke="#9C9C9C" strokeDasharray="4 4" />
      </g>
    </svg>
  );
}

export function HomeCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || prefersReducedMotion() || !contextSafe) return;
      const q = gsap.utils.selector(el);
      const card = q("[data-cta-card]")[0] as HTMLElement;

      // Entrance: card rises, server slides in along the isometric axis, screen drops, lock lands.
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none none" }, defaults: { ease: "expo.out" } });
      tl.from(card, { y: 60, opacity: 0, duration: 1.1 })
        .from(q("[data-art=server]"), { xPercent: 14, yPercent: 8, opacity: 0, duration: 1.4 }, 0.15)
        .from(q("[data-art=screen]"), { yPercent: -18, opacity: 0, duration: 1.3 }, 0.35)
        .from(q("[data-art=lock]"), { yPercent: -45, opacity: 0, duration: 1.2, ease: "bounce.out" }, 0.65)
        .from(q("[data-cta-copy] > *"), { y: 28, opacity: 0, duration: 1, stagger: 0.1, clearProps: "transform" }, 0.3)
        .from(q("[data-diamond]"), { opacity: 0, scale: 0.6, duration: 1, stagger: 0.15 }, 0.5);

      // Idle: lock floats, glow breathes, diamonds drift.
      gsap.to(q("[data-lock-float]"), { y: -12, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.fromTo(q("[data-lock-glow]"), { opacity: 0.25, scale: 0.9 }, { opacity: 0.6, scale: 1.08, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(q("[data-diamond]"), { y: -8, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.8 });

      // Pointer: lock + glow parallax, spotlight follows cursor.
      if (!window.matchMedia("(hover: hover)").matches) return;
      const lx = gsap.quickTo(q("[data-lock-move]"), "x", { duration: 0.8, ease: "power3.out" });
      const ly = gsap.quickTo(q("[data-lock-move]"), "y", { duration: 0.8, ease: "power3.out" });
      const move = contextSafe((e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        lx(nx * 18);
        ly(ny * 14);
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
      const leave = contextSafe(() => {
        lx(0);
        ly(0);
      });
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      return () => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="home-cta-title" className="pt-[64px] pb-[64px] md:pt-[96px] md:pb-[96px] xl:pt-[120px] xl:pb-[120px]">
      <Container>
        <div
          data-cta-card
          className="group/card relative isolate overflow-hidden rounded-[8px] bg-cx-bg-2 lg:h-[560px] xl:h-[640px]"
        >
          {/* isometric grid */}
          <Image src="/site/home/card-grid-bg.webp" alt="" fill unoptimized sizes="1189px" className="pointer-events-none -z-10 object-cover object-left-top select-none" />
          {/* cursor spotlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(225,38,50,0.10), transparent 70%)" }}
          />
          <div data-diamond className="pointer-events-none absolute hidden lg:block" style={{ left: 338, top: 35 }}>
            <Diamond />
          </div>
          <div data-diamond className="pointer-events-none absolute hidden lg:block" style={{ left: 550, top: 483 }}>
            <Diamond />
          </div>

          {/* copy */}
          <div className="relative z-10 flex h-full items-center px-[24px] pt-[40px] md:px-[48px] md:pt-[56px] lg:pt-0 xl:px-[79px]">
            <div data-cta-copy className="flex w-full max-w-[470px] flex-col lg:max-w-[420px] xl:max-w-[470px]">
              <SectionTag>Get in touch</SectionTag>
              <SplitReveal as="h2" className={`${H2} py-[16px]`}>
                <span id="home-cta-title">
                  Start <A>protecting</A>
                  <br className="max-md:hidden" /> your online presence
                </span>
              </SplitReveal>
              <p className={`${P} max-w-[426px]`}>Lorem ipsum dolor sit amet consectetur. Eget nulla magna odio eu dictumst. Nisl scelerisque augue.</p>
              <div className="pt-[24px]">
                <Magnetic strength={0.25}>
                  <PrimaryButton href="/contact">Get in touch</PrimaryButton>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* illustration — anchored top-right; in flow below the copy on small screens */}
          <div
            aria-hidden
            className="pointer-events-none relative mt-[24px] ml-auto w-[88%] max-w-[568px] select-none md:w-[62%] lg:absolute lg:top-0 lg:right-0 lg:mt-0 lg:w-[47.75%] lg:max-w-none xl:w-[567.8px]"
            style={{ aspectRatio: `${AW} / ${AH}` }}
          >
            <div data-art="server" className="absolute" style={place(0, 34.2, 567.8, AW, AH)}>
              <Image src="/site/home/cta-server.webp" alt="" width={568} height={589} unoptimized className="h-auto w-full" />
            </div>
            <div data-art="screen" className="absolute" style={place(116.1, 0, 451.8, AW, AH)}>
              <Image src="/site/home/cta-screen.webp" alt="" width={452} height={412} unoptimized className="h-auto w-full" />
            </div>
            <div data-art="lock" className="absolute" style={place(416.2, 67.6, 144.3, AW, AH)}>
              <div data-lock-move>
                <div data-lock-float className="relative">
                  <div
                    data-lock-glow
                    className="absolute top-[40%] left-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
                    style={{ background: "radial-gradient(circle, rgba(225,38,50,0.55) 0%, rgba(225,38,50,0.12) 45%, transparent 70%)" }}
                  />
                  <Image src="/site/home/cta-lock.webp" alt="" width={145} height={257} unoptimized className="relative h-auto w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* top border overlay (Figma 3:3169) — keeps the stroke above the illustration */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[8px] border border-cx-line" />
        </div>
      </Container>
    </section>
  );
}
