"use client";

/**
 * Features — "Why us" (Figma 3:8554 heading, 3:8559 / 3:8570 columns, 3:8581 shield, 3:8551 grid).
 * Desktop (≥1280, motion allowed): the section pins and a scrubbed sequence plays —
 * the shield rises/rotates into place, accent connector lines draw (DrawSVG) from each feature
 * to the shield while that feature lights up, then the connectors fade so the resting frame
 * matches Figma exactly. Smaller screens / reduced motion: simple staggered reveals.
 */
import { useRef } from "react";
import Image from "next/image";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { gsap, useGSAP, prefersReducedMotion } from "../gsap";
import { Float, Parallax, Reveal, SplitReveal } from "../anim";
import { A, Container, SectionTag } from "../ui";
import { CheckIcon } from "./shared";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(DrawSVGPlugin);

const P = "/site/features";
const BODY = "Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit.";

// Figma widths keep the exact line wrapping at 1440
const LEFT = [
  { title: "Enhanced data protection", w: "xl:w-[325px]", pw: "xl:max-w-[324.5px]" },
  { title: "Proactive security measures", w: "xl:w-[352px]", pw: "xl:max-w-[305px]" },
];
const RIGHT = [
  { title: "Expert risk management", w: "xl:w-[311px]", pw: "xl:max-w-[302px]" },
  { title: "Reliable incident response", w: "xl:w-[326px]", pw: "xl:max-w-[305px]" },
];

function Feature({ title, w, pw, i }: { title: string; w: string; pw: string; i: number }) {
  return (
    <div data-reveal data-feature={i} className={cn("flex flex-col gap-[12px] md:gap-[16px]", w)}>
      <div className="flex items-center gap-[8px]">
        <span data-check className="relative flex size-[20px] shrink-0 items-center justify-center text-white">
          <span data-ring aria-hidden className="absolute inset-[-6px] rounded-full border border-cx-accent opacity-0" />
          <CheckIcon />
        </span>
        <h3 className="font-geist text-[20px] leading-[1.25] font-medium text-white md:text-[24px] xl:whitespace-nowrap">{title}</h3>
      </div>
      <p className={cn("font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px] xl:min-h-[84.09px]", pw)}>{BODY}</p>
    </div>
  );
}

// Connector curves in the columns block (container coords: block top = Figma y 1718.14, left = 125.5).
// They end underneath the (opaque) shield so only the run-up is visible.
const CONNECTORS = [
  "M356 15 C 420 15, 470 40, 560 120",
  "M356 185 C 420 185, 470 160, 560 140",
  "M852 15 C 790 15, 740 40, 640 120",
  "M852 185 C 790 185, 740 160, 640 140",
];

export function WhyUsSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1280px)", () => {
        const q = gsap.utils.selector(root);
        const feats = [0, 1, 2, 3].map((i) => q(`[data-feature="${i}"]`)[0]);
        const lines = q("[data-connector]");
        const dots = q("[data-conn-dot]");
        gsap.set(feats, { opacity: 0.22 });
        gsap.set(feats.slice(0, 2), { x: -30 });
        gsap.set(feats.slice(2), { x: 30 });
        gsap.set(lines, { drawSVG: "0%", opacity: 1 });
        gsap.set(dots, { opacity: 0, scale: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: root, start: "top top", end: "+=1500", pin: true, scrub: 1, anticipatePin: 1 },
        });
        tl.fromTo(q("[data-shield]"), { rotate: -14, scale: 0.84, y: 70, opacity: 0.4 }, { rotate: -4, scale: 0.95, y: 20, opacity: 1, duration: 1.2 });
        // feature order: left-top, right-top, left-bottom, right-bottom
        [0, 2, 1, 3].forEach((fi, step) => {
          const at = 1 + step * 1;
          tl.to(lines[fi], { drawSVG: "100%", duration: 0.8 }, at)
            .to(dots[fi], { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, at)
            .to(feats[fi], { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, at + 0.2)
            .fromTo(
              feats[fi].querySelector("[data-ring]"),
              { opacity: 1, scale: 0.4 },
              { opacity: 0, scale: 1.8, duration: 0.6, ease: "power2.out" },
              at + 0.35,
            )
            .to(feats[fi].querySelector("[data-check]"), { color: "#e12632", duration: 0.25 }, at + 0.3)
            .to(feats[fi].querySelector("[data-check]"), { color: "#ffffff", duration: 0.4 }, at + 0.9);
        });
        tl.to(q("[data-shield]"), { rotate: 0, scale: 1, y: 0, duration: 1.2 }, 4.6)
          .to(lines, { opacity: 0, duration: 0.6 }, 5.2)
          .to(dots, { opacity: 0, scale: 0, duration: 0.4 }, 5.2)
          .to({}, { duration: 0.4 });
      });
      mm.add("(max-width: 1279.98px)", () => {
        const q = gsap.utils.selector(root);
        gsap.from(q("[data-feature]"), { y: 40, opacity: 0, duration: 1, stagger: 0.12, scrollTrigger: { trigger: q("[data-features]")[0], start: "top 85%", toggleActions: "play none none none" } });
        gsap.from(q("[data-shield]"), { y: 60, rotate: -8, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: q("[data-shield]")[0], start: "top 85%", toggleActions: "play none none none" } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative isolate pt-[56px] pb-[80px] md:pt-[80px] md:pb-[100px] xl:h-[875.35px] xl:pt-[120px] xl:pb-0">
      <Container className="relative">
        {/* background grid (3:8551) */}
        <Parallax y={-60} className="pointer-events-none absolute top-[-67.3px] left-1/2 -z-10 w-[1189.4px] -translate-x-1/2 xl:left-[-24.9px] xl:translate-x-0">
          <Image src={`${P}/grid-why.webp`} alt="" width={1189.4} height={1170} className="h-auto w-full" />
        </Parallax>

        <Reveal y={16} className="flex justify-center">
          <SectionTag>Why us</SectionTag>
        </Reveal>
        <div className="flex justify-center pt-[16px]">
          <SplitReveal className="max-w-[574px] text-center font-geist text-[32px] leading-[1.25] font-medium text-white md:text-[40px] xl:text-[48px]">
            Stay ahead with our cybersecurity <A>expertise</A>
          </SplitReveal>
        </div>

        {/* columns block — xl: Figma y 1718.14, 508.5 tall */}
        <div data-features className="relative mt-[40px] flex flex-col items-center md:mt-[56px] xl:mt-[87.84px] xl:block xl:h-[508.5px]">
          {/* shield (3:8581): x 227.47 / y -143.6 relative to the block, 651.6×564.3 */}
          <div className="pointer-events-none relative order-first -my-[12%] w-full max-w-[520px] md:max-w-[600px] xl:absolute xl:top-[-143.6px] xl:left-[227.47px] xl:z-10 xl:my-0 xl:w-[651.6px] xl:max-w-none">
            <div data-shield className="will-change-transform">
              <Float y={10} duration={3.6}>
                <Image src={`${P}/shield.webp`} alt="" width={651.6} height={564.3} className="h-auto w-full" />
              </Float>
            </div>
          </div>

          <svg aria-hidden viewBox="0 0 1189 508.5" fill="none" className="pointer-events-none absolute inset-0 z-0 hidden size-full overflow-visible xl:block">
            {CONNECTORS.map((d, i) => (
              <g key={i}>
                <path data-connector d={d} stroke="#e12632" strokeWidth="1" strokeDasharray="0" opacity="0" />
                <circle data-conn-dot cx={d.split(" ")[0].slice(1)} cy={d.split(" ")[1]} r="3" fill="#e12632" opacity="0" style={{ transformOrigin: "center", transformBox: "fill-box" }} />
              </g>
            ))}
          </svg>

          <div className="relative z-20 grid w-full gap-[32px] md:grid-cols-2 md:gap-x-[40px] md:gap-y-[40px] xl:contents">
            <div className="flex flex-col gap-[32px] md:gap-[40px] xl:absolute xl:top-0 xl:left-[0.5px]">
              {LEFT.map((f, i) => (
                <Feature key={f.title} {...f} i={i} />
              ))}
            </div>
            <div className="flex flex-col gap-[32px] md:gap-[40px] xl:absolute xl:top-0 xl:left-[860.5px]">
              {RIGHT.map((f, i) => (
                <Feature key={f.title} {...f} i={i + 2} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
