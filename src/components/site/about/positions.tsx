"use client";

/**
 * "Browse our open positions" — Figma 3:7449 (full-bleed, y 3342.8, 1440×1098).
 * Header (tag + 404.5 heading | 460 paragraph, bottom-aligned) · 64 gap · three 233px rows split by full-width #212121 lines.
 * Row: title/desc 477.5 at 0 · meta at 694 (top 21.5) · "Apply now" at 1053 (top 29).
 */
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Container, SectionTag, A } from "@/components/site/ui";
import { SplitReveal, Reveal } from "@/components/site/anim";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";
import { cn } from "@/lib/utils";

const JOBS = [
  { title: "UX/UI Product Designer", location: "Los Angeles, CA", type: "Part time" },
  { title: "Junior Frontend Developer", location: "San Francisco, CA", type: "Full time" },
  { title: "Finance Analyst", location: "New York, NY", type: "Part time" },
];

export function AboutPositions() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-job]", root.current).forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none none" } });
        tl.from(row.querySelector("[data-line]"), { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "expo.inOut" })
          .from(row.querySelectorAll("[data-col]"), { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: "expo.out" }, "-=0.9");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="py-[80px] md:py-[100px] xl:py-[120px]">
      <Container>
        <div className="flex flex-col gap-[24px] md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTag className="md:h-[23px]">Open positions</SectionTag>
            <div className="pt-[16px]">
              <SplitReveal className="max-w-[404.5px] font-geist text-[34px] leading-[1.25] font-medium text-white md:text-[48px]">
                Browse our open <A>positions</A>
              </SplitReveal>
            </div>
          </div>
          <Reveal as="p" className="max-w-[460px] font-geist text-[16px] leading-[1.5] text-cx-muted md:mb-[1.18px] md:w-[460px] md:text-[18px]" delay={0.15}>
            Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui. Tellus blandit morbi.
          </Reveal>
        </div>
      </Container>

      <ul className="mt-[48px] md:mt-[64px]">
        {JOBS.map((job, i) => (
          <li key={job.title} data-job className="group relative">
            <span data-line aria-hidden className="absolute inset-x-0 top-0 h-px bg-cx-line" />
            {/* hover sweep */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-px bottom-0 origin-left scale-x-0 bg-[linear-gradient(90deg,rgba(225,38,50,0.08),rgba(225,38,50,0.02)_60%,transparent)] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100"
            />
            <Container className={cn("relative pt-[40px] md:pt-[64px]", i < JOBS.length - 1 ? "pb-[40px] md:pb-[64px]" : "")}>
              <div className="flex flex-col gap-[24px] md:grid md:grid-cols-[1fr_auto_auto] md:items-start md:gap-x-[40px] xl:grid-cols-[694px_359px_auto] xl:gap-0">
                <div data-col className="flex flex-col gap-[16px]">
                  <h3 className="font-geist text-[22px] leading-[1.25] font-medium text-white transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-[8px] md:text-[24px]">
                    {job.title}
                  </h3>
                  <p className="max-w-[477.5px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px] xl:h-[59.08px]">
                    Lorem ipsum dolor sit amet consectetur. Non donec eget ut felis sed in. Aliquam scelerisque facilisis volutpat a dui.
                  </p>
                </div>
                <dl data-col className="flex flex-col gap-[16px] md:pt-[21.54px]">
                  <div className="flex items-start gap-[12px]">
                    <dt className="sr-only">Location</dt>
                    <Image src="/site/about/icons/pin.svg" alt="" width={19} height={22} className="h-[22px] w-[18.97px]" />
                    <dd className="font-geist text-[18px] leading-[1.25] font-medium whitespace-nowrap text-[#e6e6e6]">{job.location}</dd>
                  </div>
                  <div className="flex items-start gap-[12px]">
                    <dt className="sr-only">Type</dt>
                    <Image src="/site/about/icons/clock.svg" alt="" width={22} height={22} className="size-[22px]" />
                    <dd className="font-geist text-[18px] leading-[1.25] font-medium whitespace-nowrap text-[#e6e6e6]">{job.type}</dd>
                  </div>
                </dl>
                <div data-col className="md:pt-[29.04px]">
                  <Link
                    href="/contact"
                    aria-label={`Apply now for ${job.title}`}
                    className="group/btn relative inline-flex items-center justify-center overflow-hidden rounded-[8px] bg-white px-[24px] py-[12px] font-geist text-[18px] leading-[1.25] font-medium whitespace-nowrap text-cx-bg transition-transform duration-300 active:scale-[0.97]"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-cx-accent transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/btn:scale-x-100" />
                    <span className="relative transition-colors duration-300 group-hover/btn:text-white">Apply now</span>
                  </Link>
                </div>
              </div>
            </Container>
          </li>
        ))}
      </ul>
    </section>
  );
}
