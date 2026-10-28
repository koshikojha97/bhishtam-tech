"use client";

/**
 * About hero — Figma "About" 3:6643 (y 0 → 1114).
 * Grid bg 3:6644 · copy 3:6650 · globe 3:6752 + pedestal 3:6658 · stats 3:6778/6786/6782/6790 · divider 3:6648.
 */
import Image from "next/image";
import { useRef } from "react";
import { Container, SectionTag, A, PrimaryButton, SecondaryButton } from "@/components/site/ui";
import { SplitReveal, CountUp, Magnetic } from "@/components/site/anim";
import { ParticleBackground } from "@/components/site/three/particle-background";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";
import { cn } from "@/lib/utils";

const STATS = [
  { value: 99, suffix: "%", label: "Customer satisfaction" },
  { value: 575, suffix: "+", label: "Successful Projects" },
  { value: 32, suffix: "M", label: "Users served" },
  { value: 240, suffix: "%", label: "Company growth" },
];

export function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // copy + illustration entrance
      gsap
        .timeline({ delay: 0.35 })
        .from(q("[data-hero-fade]"), { y: 28, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.15)
        .from(q("[data-pedestal]"), { y: 90, opacity: 0, duration: 1.3, ease: "expo.out" }, 0.1)
        .from(q("[data-globe]"), { y: -60, scale: 0.86, rotate: -14, opacity: 0, duration: 1.6, ease: "expo.out" }, 0.25)
        .from(q("[data-stat]"), { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.5);

      // idle: globe hovers above the pedestal and slowly sways
      gsap.to(q("[data-globe-float]"), { y: -16, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(q("[data-globe-spin]"), { rotate: 4, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // scroll: grid drifts, illustration recedes
      gsap.to(q("[data-grid]"), { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(q("[data-art]"), { y: 120, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 } });

      // pointer 3D tilt on the globe
      const art = q("[data-tilt]")[0] as HTMLElement | undefined;
      if (!art || !contextSafe || !window.matchMedia("(hover: hover)").matches) return;
      const rx = gsap.quickTo(art, "rotationX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(art, "rotationY", { duration: 0.9, ease: "power3.out" });
      const move = contextSafe((e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        ry(nx * 14);
        rx(-ny * 10);
      });
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden border-b border-cx-line xl:h-[1114px]">
      {/* grid background (masked isometric grid, 20% opacity, fades in towards the bottom) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <div data-grid className="absolute top-0 left-1/2 h-[1114px] w-[1440px] -translate-x-1/2 max-xl:h-full max-xl:w-[max(100%,900px)]">
          <Image src="/site/about/hero-grid.webp" alt="" fill priority unoptimized className="object-cover object-bottom" />
        </div>
        {/* Three.js layer: soft particle wave under the stats */}
        <div className="absolute inset-x-0 bottom-0 h-[420px] [mask-image:linear-gradient(to_top,black,transparent)]">
          <ParticleBackground variant="wave" density={0.7} opacity={0.45} className="absolute inset-0" />
        </div>
      </div>

      <div className="relative flex flex-col pt-[140px] md:pt-[170px] xl:block xl:p-0">
        {/* copy 3:6650 at (125.5, 274.2) */}
        <Container className="xl:pt-[274px]">
          <div className="max-w-[590px]">
            <div data-hero-fade>
              <SectionTag className="md:h-[23px]">About us</SectionTag>
            </div>
            <div className="py-[16px]">
              <SplitReveal
                as="h1"
                immediate
                delay={0.45}
                className="max-w-[550.5px] font-geist text-[44px] leading-[1.15] font-medium text-white md:text-[64px] xl:text-[72px]"
              >
                Our mission: Protecting your <A>digital frontier</A>
              </SplitReveal>
            </div>
            <p data-hero-fade className="font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px] xl:h-[58.5px]">
              Lorem ipsum dolor sit amet consectetur sagittis amet placerat elementum ornare eget amet massa egestas adipiscing est.
            </p>
            <div data-hero-fade className="flex flex-wrap items-center pt-[24px]">
              <Magnetic strength={0.25}>
                <PrimaryButton href="/signup">Join us</PrimaryButton>
              </Magnetic>
              <SecondaryButton href="/features">Learn more</SecondaryButton>
            </div>
          </div>
        </Container>
      </div>

      {/* illustration — absolute at desktop (x 642 / y 88), stacked below copy on smaller screens */}
      <div
        data-art
        className={cn(
          "pointer-events-none relative mx-auto mt-[8px] mb-[48px] aspect-[742/799] w-[min(560px,92vw)] [perspective:1200px]",
          "xl:absolute xl:top-[88px] xl:left-[calc(50%-78px)] xl:mt-0 xl:aspect-auto xl:h-[799px] xl:w-[742px]",
        )}
        aria-hidden
      >
        <div data-tilt className="absolute inset-0 [transform-style:preserve-3d]">
          {/* pedestal 3:6658 — 285×213 at (859.3, 674.6) → offset (217.3, 586.6) inside the 742 box */}
          <div data-pedestal className="absolute top-[73.42%] left-[29.29%] w-[38.44%]">
            <Image src="/site/about/pedestal.webp" alt="" width={285} height={213} className="h-auto w-full" />
          </div>
          {/* globe 3:6752 — 742×772 at (642, 88) */}
          <div data-globe className="absolute top-0 left-0 w-full">
            <div data-globe-float>
              <div data-globe-spin>
                <Image src="/site/about/globe.webp" alt="" width={742} height={772} priority className="h-auto w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* stats — y 934; x 138 / 499 / 833 / 1131 */}
      <Container className="relative pb-[72px] xl:absolute xl:top-[934px] xl:left-1/2 xl:-translate-x-1/2 xl:p-0">
        <dl className="grid grid-cols-2 gap-x-[24px] gap-y-[40px] md:grid-cols-4 xl:grid-cols-[361px_334px_298px_auto] xl:gap-0 xl:pl-[12.5px]">
          {STATS.map((s) => (
            <div key={s.label} data-stat className="flex flex-col-reverse">
              <dt className="font-geist text-[16px] leading-[1.25] font-medium whitespace-nowrap text-white md:text-[18px]">{s.label}</dt>
              <dd className="font-geist text-[48px] leading-[1.15] font-medium whitespace-nowrap text-white md:text-[60px] xl:text-[72px]">
                <CountUp value={s.value} duration={2.2} />
                <span className="text-cx-accent">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
