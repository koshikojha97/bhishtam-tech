"use client";

/**
 * Home V3 services — Figma `3:789` (y 1354, 1592×754, row of four 380×420 cards bleeding off both edges).
 * Desktop/tablet: GSAP Draggable + Inertia horizontal drag (bounded so every card can be fully revealed),
 * cursor-follow "Drag" badge, card glow following the pointer. Mobile: native snap scrolling.
 */
import { useRef } from "react";
import Image from "next/image";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";
import { Magnetic, Reveal, SplitReveal } from "@/components/site/anim";
import { A, PrimaryButton, SecondaryButton, SectionTag } from "@/components/site/ui";

if (typeof window !== "undefined") gsap.registerPlugin(Draggable, InertiaPlugin);

type Art = { src: string; x: number; y: number; w: number; h: number };
const DESC = "Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui. Tellus blandit.";
const BG: Art = { src: "/site/home/svc-card-bg.webp", x: 0, y: 0, w: 380, h: 420 };

const CARDS: { title: string; art: Art[] }[] = [
  // card 1 is clipped by the Figma frame at x<0 → full bg + the visible 304px of its art at x 76
  { title: "Network protection", art: [BG, { src: "/site/home/svc-network-partial.webp", x: 76, y: 0, w: 304, h: 420 }] },
  { title: "Data security", art: [BG, { src: "/site/home/svc-data.webp", x: 104, y: 196.5, w: 173, h: 175.5 }] },
  { title: "Malware prevention", art: [{ src: "/site/home/svc-malware.webp", x: 0, y: 0, w: 380, h: 420 }] },
  { title: "Cloud security", art: [BG, { src: "/site/home/svc-cloud.webp", x: 93.5, y: 170.5, w: 196.5, h: 229 }] },
];

const TRACK_W = 380 * 4 + 24 * 3; // 1592

function ServiceCard({ title, art }: (typeof CARDS)[number]) {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <article
      data-svc-card
      onPointerMove={onMove}
      className="group relative h-[420px] w-[380px] shrink-0 snap-center overflow-hidden rounded-[8px] bg-cx-bg select-none"
    >
      {art.map((a, i) => (
        <Image
          key={a.src + i}
          src={a.src}
          alt=""
          width={Math.round(a.w)}
          height={Math.round(a.h)}
          draggable={false}
          data-svc-art={i === art.length - 1 && art.length > 1 ? "" : undefined}
          className={
            "pointer-events-none absolute max-w-none " +
            (i === art.length - 1 && a.w < 380 ? "transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-[8px] group-hover:scale-[1.04]" : "")
          }
          style={{ left: a.x, top: a.y, width: a.w, height: a.h }}
        />
      ))}
      {/* cursor glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(225,38,50,0.16), transparent 60%)" }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[8px] border border-cx-line transition-colors duration-500 group-hover:border-cx-accent/50" />
      <div className="relative box-content w-[297.5px] pt-[37.5px] pl-[38.3px]">
        <h3 className="font-geist text-[24px] leading-[1.25] font-medium text-white">{title}</h3>
        <p className="pt-[16px] font-geist text-[18px] leading-[1.5] text-cx-muted">{DESC}</p>
      </div>
    </article>
  );
}

export function HomeServices() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      const tr = track.current;
      if (!el || !tr || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      // cards slide in from the right, staggered
      gsap.from(tr.querySelectorAll("[data-svc-card]"), {
        x: 160,
        opacity: 0,
        duration: 1.3,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: tr, start: "top 85%", toggleActions: "play none none none" },
      });

      mm.add("(min-width: 768px)", () => {
        const bounds = () => {
          const vw = el.clientWidth;
          const left = vw / 2 - TRACK_W / 2; // track is centred like Figma (x −76 @1440)
          const pad = 24;
          return { minX: Math.min(0, vw - pad - (left + TRACK_W)), maxX: Math.max(0, pad - left) };
        };
        const [drag] = Draggable.create(tr, {
          type: "x",
          inertia: true,
          bounds: bounds(),
          edgeResistance: 0.85,
          dragResistance: 0,
          cursor: "grab",
          activeCursor: "grabbing",
          allowContextMenu: true,
          zIndexBoost: false,
          onPress: () => gsap.to(badge.current, { scale: 0.8, duration: 0.3 }),
          onRelease: () => gsap.to(badge.current, { scale: 1, duration: 0.4, ease: "back.out(3)" }),
        });
        const onResize = () => {
          drag.applyBounds(bounds());
        };
        window.addEventListener("resize", onResize);

        // "Drag" badge following the pointer over the row
        if (contextSafe && window.matchMedia("(hover: hover)").matches && badge.current) {
          const b = badge.current;
          const bx = gsap.quickTo(b, "x", { duration: 0.45, ease: "power3.out" });
          const by = gsap.quickTo(b, "y", { duration: 0.45, ease: "power3.out" });
          const row = tr.parentElement!;
          const move = contextSafe((e: PointerEvent) => {
            const r = row.getBoundingClientRect();
            bx(e.clientX - r.left - 44);
            by(e.clientY - r.top - 44);
          });
          const enter = contextSafe(() => gsap.to(b, { autoAlpha: 1, scale: 1, duration: 0.35 }));
          const leave = contextSafe(() => gsap.to(b, { autoAlpha: 0, scale: 0.5, duration: 0.3 }));
          row.addEventListener("pointermove", move);
          row.addEventListener("pointerenter", enter);
          row.addEventListener("pointerleave", leave);
          return () => {
            window.removeEventListener("resize", onResize);
            row.removeEventListener("pointermove", move);
            row.removeEventListener("pointerenter", enter);
            row.removeEventListener("pointerleave", leave);
            drag.kill();
          };
        }
        return () => {
          window.removeEventListener("resize", onResize);
          drag.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Our services" className="relative overflow-hidden pt-[120px] md:pt-[180px] xl:pt-[240px]">
      <div className="flex flex-col items-center px-[20px] text-center md:px-[32px]">
        <Reveal y={16}>
          <SectionTag>Our services</SectionTag>
        </Reveal>
        <div className="pt-[16px] pb-[40px] md:pb-[64px]">
          <SplitReveal as="h2" className="max-w-[730px] font-geist text-[32px] leading-[1.25] font-medium text-white md:text-[48px]">
            We are security experts on all <br className="hidden md:block" />
            <A>technologies</A> &amp; <A>platforms</A>
          </SplitReveal>
        </div>
      </div>

      {/* card row — Figma: 1592 wide, centred (x −76 @1440) */}
      <div className="relative">
        <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto px-[20px] [scrollbar-width:none] md:block md:snap-none md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          <div
            ref={track}
            className="flex w-max gap-[16px] [zoom:0.82] md:relative md:left-1/2 md:ml-[-796px] md:gap-[24px] md:[zoom:1] md:touch-pan-y"
          >
            {CARDS.map((c) => (
              <ServiceCard key={c.title} {...c} />
            ))}
          </div>
        </div>
        <div
          ref={badge}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 z-10 hidden size-[88px] scale-50 items-center justify-center rounded-full bg-cx-accent font-geist text-[15px] font-medium text-white opacity-0 shadow-[0_10px_40px_-8px_rgba(225,38,50,0.7)] md:flex"
        >
          Drag
        </div>
      </div>

      <Reveal className="flex flex-wrap items-center justify-center gap-[16px] px-[20px] pt-[48px] md:pt-[64px]" stagger={0.1}>
        <div data-reveal>
          <Magnetic strength={0.25}>
            <PrimaryButton href="/contact">Get in touch</PrimaryButton>
          </Magnetic>
        </div>
        <div data-reveal>
          <SecondaryButton href="/features" className="px-0">
            Browse all services
          </SecondaryButton>
        </div>
      </Reveal>
    </section>
  );
}
