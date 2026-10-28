"use client";

/**
 * Home V3 "Empowering users" — Figma bg mask `3:1886` + content `3:1889` (y 2227.6, pt/pb 120).
 * Section spans Figma y 2108 → 3181 (end of services → start of case studies).
 * Animations: parallax grid + monitor (scroll-scrubbed), monitor idle float, heading line reveal,
 * staggered feature list, magnetic CTA.
 */
import Image from "next/image";
import { Float, Magnetic, Parallax, Reveal, SplitReveal } from "@/components/site/anim";
import { A, Container, PrimaryButton, SectionTag } from "@/components/site/ui";

const ITEMS = [
  { icon: "/site/home/icon-shield.svg", w: 19.923, title: "Proven protection", h: 55.178 },
  { icon: "/site/home/icon-clock.svg", w: 24, title: "24/7 monitoring", h: 63.413 },
];
const DESC = "Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui. Tellus blandit morbi.";

export function HomeAbout() {
  return (
    <section aria-label="About us" className="relative overflow-hidden pt-[96px] pb-[96px] md:pt-[140px] xl:h-[1073px] xl:pt-[239.6px] xl:pb-0">
      {/* grid mask (Figma x 12.2, y +179.7 → 890×837) */}
      <Parallax y={-90} className="pointer-events-none absolute top-[120px] left-1/2 ml-[-707.8px] h-[837px] w-[890px] max-xl:opacity-60 xl:top-[179.7px]">
        <Image src="/site/home/about-grid.webp" alt="" width={890} height={837} className="size-full max-w-none select-none" />
      </Parallax>

      <Container className="relative">
        <div className="flex flex-col items-center gap-[56px] xl:flex-row xl:items-start xl:justify-between xl:gap-0">
          {/* monitor illustration (3:1890, 605×604) */}
          <Parallax y={-60} className="w-full max-w-[605px] shrink-0">
            <Reveal y={60} scale={0.94} blur start="top 85%">
              <Float y={10} duration={3.6}>
                <Image src="/site/home/about-monitor.webp" alt="Isometric monitor showing a security alert and password prompt" width={606} height={605} className="h-auto w-full max-w-[606px] select-none" />
              </Float>
            </Reveal>
          </Parallax>

          {/* copy (3:2279, 460 wide, +15.7px below the art top) */}
          <div className="flex w-full max-w-[460px] flex-col items-start xl:mt-[15.7px]">
            <Reveal y={16}>
              <SectionTag>About us</SectionTag>
            </Reveal>
            <div className="py-[16px]">
              <SplitReveal as="h2" className="font-geist text-[32px] leading-[1.25] font-medium text-white md:text-[48px] xl:w-[458px]">
                <A>Empowering</A> users: Our cybersecurity commitment
              </SplitReveal>
            </div>
            <Reveal className="flex flex-col gap-[32px]" stagger={0.15} x={-24} y={0}>
              {ITEMS.map((it) => (
                <div key={it.title} data-reveal className="flex flex-col gap-[16px]">
                  <div className="flex items-center gap-[12px]">
                    <Image src={it.icon} alt="" width={Math.round(it.w)} height={24} className="h-[24px] shrink-0" style={{ width: it.w }} />
                    <h3 className="font-geist text-[20px] leading-[1.25] font-medium whitespace-nowrap text-white md:text-[24px]">{it.title}</h3>
                  </div>
                  <p className="font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px] xl:h-[var(--ph)]" style={{ ["--ph" as string]: `${it.h}px` }}>
                    {DESC}
                  </p>
                </div>
              ))}
            </Reveal>
            <Reveal y={20} className="pt-[48px]">
              <Magnetic strength={0.25}>
                <PrimaryButton href="/contact">Get in touch</PrimaryButton>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
