"use client";

/**
 * Features — "Our services" hero + 4 feature cards (Figma 3:7539).
 * Animations: SplitText hero heading, staggered card reveal, cursor-follow glow border,
 * per-card illustration intros (DrawSVG network links, dropping chips/servers, magnifier sweep,
 * floating cloud), idle floats and pointer parallax on the illustration layers.
 */
import { useId, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { gsap, useGSAP, prefersReducedMotion } from "../gsap";
import { Reveal, SplitReveal } from "../anim";
import { A, Container, SecondaryButton, SectionTag } from "../ui";
import { box, ExternalArrow, GlowCard } from "./shared";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(DrawSVGPlugin);

const P = "/site/features";

/** depth wrapper (pointer parallax) > intro wrapper > float wrapper */
function Piece({ style, depth = 10, className, children }: { style?: React.CSSProperties; depth?: number; className?: string; children: React.ReactNode }) {
  return (
    <div style={style} data-depth={depth} className={cn("will-change-transform", className)}>
      <div data-intro>
        <div data-float>{children}</div>
      </div>
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-geist text-[20px] leading-[1.25] font-medium text-white md:text-[24px]">{children}</h3>;
}
function CardText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mt-[12px] font-geist text-[16px] leading-[1.5] text-cx-muted md:mt-[16px] md:text-[18px]", className)}>{children}</p>;
}
function CardArrow({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "absolute z-30 flex size-[32px] items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-cx-accent focus-visible:bg-cx-accent focus-visible:outline-none xl:size-[20px] xl:rounded-none xl:hover:bg-transparent xl:hover:text-cx-accent",
        className,
      )}
    >
      <ExternalArrow className="transition-transform duration-300 group-hover/card:translate-x-[2px] group-hover/card:-translate-y-[2px]" />
    </Link>
  );
}

/* ---------------- Card 1 · Network protection (784×380) ---------------- */
// illustration artboard: card x 336 → 784, y 0 → 380
const n = box(448, 380);
const LINES = [
  { s: n(282.4, 157.3, 166, 42), vb: "0 0 166 42", d: "M0.249756 0.5L70.4998 41L141.25 0.5L165.75 14.625", g: { x1: -1, y1: 0.5, x2: 176.75, y2: 17.5, a: "#8D8D8D", b: "#272727" } },
  { s: n(211.5, 197.9, 122, 71), vb: "0 0 122 71", d: "M0.249512 0.433289L121.25 70.1208", g: { x1: 60.75, y1: 0.43, x2: 60.75, y2: 70.12, a: "#FFFFFF", b: "#272727" } },
  { s: n(138.7, 116.3, 145, 44), vb: "0 0 145 44", d: "M143.844 41.4375L73.157 0.5L0.250732 42.75", g: { x1: -5.59, y1: 40.63, x2: 145.53, y2: 42.13, a: "#1E1E1E", b: "#8F8F8F" } },
  { s: n(92.1, 197.6, 121, 71), vb: "0 0 121 71", d: "M0.250488 69.8702L120.188 0.432739", g: { x1: 60.5, y1: 0.43, x2: 60.5, y2: 70.06, a: "#FFFFFF", b: "#272727" } },
  { s: n(210.5, 115.2, 145, 85), vb: "0 0 145 85", d: "M0.249756 83.6832L144.687 0.433167", g: { x1: 141.63, y1: 0.43, x2: 2, y2: 82.68, a: "#1E1E1E", b: "#FFFFFF" } },
];
const CHIPS = [
  { s: n(0.7, 92.6, 141), src: "chip-blue", d: 14 },
  { s: n(281.9, 256.1, 141), src: "chip-blue", d: 22 },
  { s: n(0.7, 256.0, 141), src: "chip-white", d: 18 },
  { s: n(282.2, 11.6, 141), src: "chip-white", d: 10 },
];

function NetworkCard() {
  const uid = useId().replace(/:/g, "");
  return (
    <GlowCard bg={`${P}/card-network-bg.webp`} bgSizes="(min-width: 1280px) 784px, 100vw" className="flex flex-col md:block md:h-[380px]" >
      <div data-card="network" className="contents">
        <div className="relative z-10 p-[24px] pb-0 md:absolute md:top-1/2 md:left-[31px] md:w-[298px] md:-translate-y-1/2 md:p-0">
          <CardTitle>Network protection</CardTitle>
          <CardText className="xl:min-h-[84.09px]">Lorem ipsum dolor sit amet consectetur lacus id turpis ut nulla dui proin nunc dui tellus blandit.</CardText>
          <SecondaryButton href="/pricing" className="mt-[16px] px-0" aria-label="Learn more about network protection">
            Learn more
          </SecondaryButton>
        </div>
        <div className="relative mx-auto aspect-[448/380] w-[calc(100%-24px)] max-w-[448px] md:absolute md:top-0 md:right-0 md:h-[380px] md:w-[448px] md:max-w-none md:origin-right md:scale-[0.82] xl:right-auto xl:left-[336px] xl:scale-100">
          {LINES.map((l, i) => (
            <svg key={i} viewBox={l.vb} fill="none" aria-hidden style={l.s} className="overflow-visible">
              <path data-draw d={l.d} stroke={`url(#${uid}l${i})`} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <defs>
                <linearGradient id={`${uid}l${i}`} x1={l.g.x1} y1={l.g.y1} x2={l.g.x2} y2={l.g.y2} gradientUnits="userSpaceOnUse">
                  <stop stopColor={l.g.a} />
                  <stop offset="1" stopColor={l.g.b} />
                </linearGradient>
              </defs>
            </svg>
          ))}
          {CHIPS.map((c, i) => (
            <Piece key={i} style={c.s} depth={c.d}>
              <Image src={`${P}/${c.src}.webp`} alt="" width={141} height={105.5} className="h-auto w-full" />
            </Piece>
          ))}
        </div>
      </div>
    </GlowCard>
  );
}

/* ---------------- Card 2 · Data security (380×380) ---------------- */
const s2 = box(173, 175.5);
function DataCard() {
  return (
    <GlowCard bg={`${P}/card-data-bg.webp`} bgSizes="(min-width: 1280px) 380px, 100vw" className="flex flex-col md:flex-row md:items-center xl:block xl:h-[380px]">
      <div data-card="data" className="contents">
        <CardArrow href="/contact" label="Talk to us about data security" className="top-[14px] right-[12px] xl:top-[21.5px] xl:right-[18px]" />
        <div className="relative mx-auto mt-[28px] aspect-[173/175.5] w-[173px] shrink-0 md:mx-[56px] md:my-[40px] xl:mx-0 xl:mt-[22.4px] xl:mb-0 xl:ml-[106px]">
          <Piece style={s2(0, 46, 173)} depth={10}>
            <Image src={`${P}/server-bottom.webp`} alt="" width={173} height={129.5} className="h-auto w-full" />
          </Piece>
          <Piece style={s2(0, 0, 173)} depth={20} className="[&_[data-intro]]:origin-bottom">
            <div data-server-top>
              <Image src={`${P}/server-top.webp`} alt="" width={173} height={129.5} className="h-auto w-full" />
            </div>
          </Piece>
        </div>
        <div className="relative z-10 px-[24px] pt-[20px] pb-[24px] md:p-0 md:pr-[40px] xl:px-[38px] xl:pt-[19.1px]">
          <CardTitle>Data security</CardTitle>
          <CardText className="xl:max-w-[298px]">Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui. Tellus blandit.</CardText>
        </div>
      </div>
    </GlowCard>
  );
}

/* ---------------- Card 3 · Malware prevention (582×380) ---------------- */
function MalwareCard() {
  return (
    <GlowCard bg={`${P}/card-malware-bg.webp`} bgSizes="(min-width: 1280px) 582px, (min-width: 768px) 50vw, 100vw" className="min-h-[360px] md:h-[380px]">
      <div data-card="malware" className="contents">
        <CardArrow href="/contact" label="Talk to us about malware prevention" className="top-[14px] right-[12px] xl:top-[22px] xl:right-[13.6px]" />
        <div className="relative z-10 p-[24px] pr-[48px] xl:absolute xl:top-[37.9px] xl:left-[32px] xl:w-[346px] xl:p-0">
          <CardTitle>Malware prevention</CardTitle>
          <CardText>Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc.</CardText>
        </div>
        <Piece depth={16} className="absolute right-[20px] bottom-[28px] w-[260px] md:w-[280px] xl:right-[36px] xl:bottom-[43.5px] xl:w-[310.7px]">
          <div data-magnifier className="origin-[75%_45%]">
            <Image src={`${P}/magnifier.webp`} alt="" width={311} height={186} className="h-auto w-full" />
          </div>
        </Piece>
      </div>
    </GlowCard>
  );
}

/* ---------------- Card 4 · Cloud security (582×380) ---------------- */
function CloudCard() {
  return (
    <GlowCard bg={`${P}/card-cloud-bg.webp`} bgSizes="(min-width: 1280px) 582px, (min-width: 768px) 50vw, 100vw" className="min-h-[380px] md:h-[380px]">
      <div data-card="cloud" className="contents">
        <CardArrow href="/contact" label="Talk to us about cloud security" className="top-[14px] right-[12px] xl:top-[22px] xl:right-[16.2px]" />
        <div className="relative z-10 p-[24px] pr-[48px] xl:absolute xl:top-[37.9px] xl:left-[37.6px] xl:w-[346px] xl:p-0">
          <CardTitle>Cloud security</CardTitle>
          <CardText>Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc.</CardText>
        </div>
        <Piece depth={18} className="absolute right-[20px] bottom-[24px] w-[150px] md:w-[170px] xl:right-[20.6px] xl:bottom-[29.3px] xl:w-[207px]">
          <Image src={`${P}/cloud.webp`} alt="" width={207} height={242} className="h-auto w-full" />
        </Piece>
      </div>
    </GlowCard>
  );
}

export function ServicesSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || prefersReducedMotion() || !contextSafe) return;
      const q = gsap.utils.selector(root);
      const st = (trigger: string | Element) => ({ trigger, start: "top 78%", toggleActions: "play none none none" });

      // Card 1 — links draw in, then chips drop onto the nodes
      const net = q("[data-card=network]")[0]?.parentElement;
      if (net) {
        const tl = gsap.timeline({ scrollTrigger: st(net), delay: 0.25 });
        tl.from(q("[data-card=network] [data-draw]"), { drawSVG: "0%", duration: 1.1, ease: "power2.inOut", stagger: 0.12 }).from(
          q("[data-card=network] [data-intro]"),
          { y: -36, opacity: 0, duration: 0.8, ease: "back.out(1.6)", stagger: 0.1 },
          0.35,
        );
        q("[data-card=network] [data-float]").forEach((el, i) =>
          gsap.to(el, { y: -6, duration: 2.2 + i * 0.35, delay: 1.6 + i * 0.2, ease: "sine.inOut", yoyo: true, repeat: -1 }),
        );
      }

      // Card 2 — top server lowers onto the bottom one, then hovers
      const data = q("[data-card=data]")[0]?.parentElement;
      if (data) {
        gsap
          .timeline({ scrollTrigger: st(data), delay: 0.35 })
          .from(q("[data-card=data] [data-intro]"), { y: -50, opacity: 0, duration: 0.9, ease: "power3.out", stagger: { each: 0.18, from: "start" } });
        gsap.to(q("[data-server-top]"), { y: -9, duration: 2.4, delay: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      // Card 3 — magnifier sweeps in then keeps "scanning"
      const mal = q("[data-card=malware]")[0]?.parentElement;
      if (mal) {
        gsap.from(q("[data-card=malware] [data-intro]"), { x: -60, y: 20, rotate: -10, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: st(mal), delay: 0.3 });
        gsap.to(q("[data-magnifier]"), { rotate: 3, x: 8, y: -4, duration: 2.8, delay: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      // Card 4 — cloud rises and floats
      const cloud = q("[data-card=cloud]")[0]?.parentElement;
      if (cloud) {
        gsap.from(q("[data-card=cloud] [data-intro]"), { y: 50, opacity: 0, scale: 0.92, duration: 1.2, ease: "expo.out", scrollTrigger: st(cloud), delay: 0.4 });
        gsap.to(q("[data-card=cloud] [data-float]"), { y: -10, duration: 3, delay: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      // Pointer parallax on illustration layers (hover devices only)
      if (!window.matchMedia("(hover: hover)").matches) return;
      const cleanups: (() => void)[] = [];
      q("[data-card]").forEach((marker) => {
        const card = marker.parentElement as HTMLElement;
        const layers = Array.from(card.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
          d: Number(el.dataset.depth) || 10,
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
        }));
        const move = contextSafe((e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach((l) => (l.x(nx * l.d), l.y(ny * l.d)));
        });
        const leave = contextSafe(() => layers.forEach((l) => (l.x(0), l.y(0))));
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        });
      });
      return () => cleanups.forEach((c) => c());
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative pt-[120px] pb-[96px] md:pt-[140px] md:pb-[110px] xl:pt-[159px] xl:pb-[119.6px]">
      <Container>
        <Reveal y={16} className="flex justify-center">
          <SectionTag>Our services</SectionTag>
        </Reveal>
        <div className="flex justify-center pt-[16px] pb-[40px] md:pb-[56px] xl:pb-[64px]">
          <SplitReveal
            as="h1"
            immediate
            delay={0.15}
            className="max-w-[1001px] text-center font-geist text-[40px] leading-[1.15] font-medium text-white md:text-[56px] xl:text-[72px]"
          >
            We are security experts on all <A>technologies</A> &amp; <A>platforms</A>
          </SplitReveal>
        </div>

        <Reveal y={60} stagger={0.14} start="top 88%" className="grid gap-[20px] md:gap-[24px] xl:grid-cols-[784px_380px]">
          <NetworkCard />
          <DataCard />
        </Reveal>
        <Reveal y={60} stagger={0.14} start="top 88%" className="mt-[20px] grid gap-[20px] md:mt-[24px] md:grid-cols-2 md:gap-[24px] xl:mt-[43.2px] xl:grid-cols-[582px_582px]">
          <MalwareCard />
          <CloudCard />
        </Reveal>
      </Container>
    </section>
  );
}
