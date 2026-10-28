"use client";

/**
 * "Our edge" — Figma 3:6794 (y 1234, 1188×1087). 2×2 values with isometric icons.
 * Columns 341 wide, 82.5 apart (grid 764.5 centred). Row 2 starts 351px below row 1.
 */
import Image from "next/image";
import { useRef } from "react";
import { Container, A } from "@/components/site/ui";
import { SplitReveal } from "@/components/site/anim";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";

type Value = { title: string; img: string; w: number; h: number; imgTop: number; textTop: number };

// imgTop / textTop: offsets (px @1440) from the row top, measured from the Figma render bounds
const VALUES: Value[] = [
  { title: "Quality", img: "edge-quality", w: 137.5, h: 152, imgTop: 0, textTop: 164.76 },
  { title: "Innovation", img: "edge-innovation", w: 207, h: 124, imgTop: 21.1, textTop: 164.76 },
  { title: "Openness", img: "edge-openness", w: 140.5, h: 152, imgTop: 0, textTop: 175.76 },
  { title: "Top tier infraestructure", img: "edge-infrastructure", w: 137.5, h: 153, imgTop: 1.1, textTop: 175.76 },
];

export function AboutEdge() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-value]", root.current);
      items.forEach((item, i) => {
        const icon = item.querySelector("[data-icon]");
        const text = item.querySelectorAll("[data-text]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none none" }, delay: (i % 2) * 0.12 });
        tl.from(icon, { y: 70, rotationX: 55, scale: 0.7, opacity: 0, duration: 1.3, ease: "expo.out", transformPerspective: 800 })
          .from(text, { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" }, "-=0.95");
        // gentle idle bob, de-synchronised per icon
        gsap.to(item.querySelector("[data-bob]"), { y: -8, duration: 2.6 + i * 0.35, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.4 });
      });
      // scrubbed depth: icons drift at a slightly different speed than the copy
      gsap.utils.toArray<HTMLElement>("[data-drift]", root.current).forEach((el) => {
        gsap.fromTo(el, { y: 8 }, { y: -8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="py-[80px] md:mt-[40px] md:py-[100px] xl:mt-[120px] xl:py-[120px]">
      <Container>
        <div className="flex flex-col items-center pb-[48px] text-center">
          {/* Figma copy has no space after the first slashes: "//Our edge //" */}
          <p className="font-geist text-[15px] leading-[1.25] font-medium text-cx-muted md:h-[23px] md:text-[18px]">
            <span className="text-cx-accent">{"//"}</span>Our edge <span className="text-cx-accent">{"//"}</span>
          </p>
          <div className="pt-[16px]">
            <SplitReveal className="max-w-[574px] font-geist text-[34px] leading-[1.25] font-medium text-white md:text-[48px]">
              The <A>core edge</A> that differentiate us
            </SplitReveal>
          </div>
        </div>

        <ul className="mx-auto grid max-w-[764.5px] grid-cols-1 gap-y-[56px] md:grid-cols-[341px_341px] md:justify-between md:gap-x-[24px] md:gap-y-[73.16px] xl:gap-x-[82.5px]">
          {VALUES.map((v) => (
            <li key={v.title} data-value className="group relative flex flex-col items-center text-center">
              <div className="relative w-full md:h-[var(--tt)]" style={{ "--tt": `${v.textTop}px` } as React.CSSProperties}>
                <div data-drift className="mx-auto max-md:mb-[16px] md:absolute md:left-1/2 md:-translate-x-1/2" style={{ top: v.imgTop, width: v.w }}>
                  <div data-icon>
                    <div data-bob>
                      <div className="transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-[10px] group-hover:scale-[1.06]">
                        <Image src={`/site/about/${v.img}.webp`} alt="" width={Math.round(v.w)} height={v.h} className="h-auto w-full" />
                      </div>
                    </div>
                  </div>
                  {/* accent glow on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-[30%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(225,38,50,0.28),transparent)] opacity-0 blur-[10px] transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
              </div>
              <h3 data-text className="font-geist text-[26px] leading-[1.25] font-medium text-white md:text-[30px] md:leading-[38px]">
                {v.title}
              </h3>
              <p data-text className="mt-[16px] w-full max-w-[341px] font-geist text-[16px] leading-[1.5] text-cx-muted md:h-[59.08px] md:text-[18px]">
                Lorem ipsum dolor sit amet consectetur. Nisl commodo erat quam metus.
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
