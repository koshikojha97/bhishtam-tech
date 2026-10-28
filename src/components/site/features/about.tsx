"use client";

/**
 * Features — "About us" (Figma 3:8758 content + 3:8755 grid + 3:8778 monitor).
 * Animations: SplitText heading, staggered list, clock hand sweep, magnetic CTA,
 * monitor slide-in + scroll parallax + idle float + pointer 3D tilt, grid parallax.
 */
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "../gsap";
import { Float, Magnetic, Parallax, Reveal, SplitReveal } from "../anim";
import { A, Container, PrimaryButton, SectionTag } from "../ui";
import { ClockIcon, ShieldIcon } from "./shared";

const P = "/site/features";
const BODY = "Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui. Tellus blandit morbi.";

function Item({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div data-reveal className="flex flex-col gap-[12px] md:gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <span className="flex shrink-0 items-center">{icon}</span>
        <h3 className="font-geist text-[20px] leading-[1.25] font-medium text-white md:text-[24px]">{title}</h3>
      </div>
      <p className="font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px] xl:min-h-[84.09px]">{BODY}</p>
    </div>
  );
}

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || prefersReducedMotion() || !contextSafe) return;
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-monitor-in]"), { x: 80, opacity: 0, rotateY: -12, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: q("[data-monitor-in]")[0], start: "top 80%", toggleActions: "play none none none" } });
      gsap.from(q("[data-hand]"), { rotate: -360, duration: 1.6, ease: "power3.inOut", scrollTrigger: { trigger: q("[data-hand]")[0], start: "top 90%", toggleActions: "play none none none" } });

      if (!window.matchMedia("(hover: hover)").matches) return;
      const tilt = q("[data-tilt]")[0] as HTMLElement | undefined;
      if (!tilt) return;
      const rx = gsap.quickTo(tilt, "rotateX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotateY", { duration: 0.9, ease: "power3.out" });
      const move = contextSafe((e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
      });
      const leave = contextSafe(() => (rx(0), ry(0)));
      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative isolate pt-[56px] pb-[96px] md:pt-[80px] md:pb-[120px] xl:pt-[130.9px] xl:pb-[250.9px]">
      <Container className="relative">
        {/* background grid (3:8755) */}
        <Parallax y={-50} className="pointer-events-none absolute right-[-120px] bottom-[-80px] -z-10 w-[700px] md:w-[846px] xl:top-[-70.8px] xl:right-auto xl:bottom-auto xl:left-[468.8px]">
          <Image src={`${P}/grid-about.webp`} alt="" width={846} height={837} className="h-auto w-full" />
        </Parallax>

        <div className="flex flex-col gap-[48px] xl:flex-row xl:items-start xl:justify-between xl:gap-0">
          <div className="w-full max-w-[620px] xl:w-[460px] xl:max-w-none xl:shrink-0">
            <Reveal y={16}>
              <SectionTag both>About us</SectionTag>
            </Reveal>
            <div className="py-[16px]">
              <SplitReveal className="max-w-[458px] font-geist text-[32px] leading-[1.25] font-medium text-white md:text-[40px] xl:text-[48px]">
                <A>Empowering</A> users: Our cybersecurity commitment
              </SplitReveal>
            </div>
            <Reveal y={30} stagger={0.15} className="flex flex-col gap-[24px] md:gap-[16px]">
              <Item icon={<ShieldIcon />} title="Proven protection" />
              <Item icon={<ClockIcon />} title="24/7 monitoring" />
            </Reveal>
            <Reveal y={20} delay={0.3} className="pt-[24px]">
              <Magnetic strength={0.25}>
                <PrimaryButton href="/contact">Get in touch</PrimaryButton>
              </Magnetic>
            </Reveal>
          </div>

          {/* monitor (3:8778) 605.6×605.1 at container x 583.6 */}
          <div className="mx-auto w-full max-w-[480px] md:max-w-[560px] xl:mx-0 xl:-mt-[11.5px] xl:w-[605.6px] xl:max-w-none xl:shrink-0 [perspective:1400px]">
            <Parallax y={-60}>
              <div data-monitor-in>
                <div data-tilt className="[transform-style:preserve-3d]">
                  <Float y={8} duration={4}>
                    <Image src={`${P}/monitor.webp`} alt="Monitor showing a security alert and a protected password field" width={605.6} height={605.1} className="h-auto w-full" />
                  </Float>
                </div>
              </div>
            </Parallax>
          </div>
        </div>
      </Container>
    </section>
  );
}
