"use client";

/**
 * 404 not found (Figma 3:9168). Hero is 938.57px tall at 1440 (footer starts at y=938.57).
 *  - bg: isometric dashed grid faded by a vertical gradient mask (3:9169, exported as one image)
 *  - giant "404" (#212121, 225.842px) with scramble-in + periodic RGB-split glitch
 *  - "Page not found" / paragraph / "Go back home" (3:9183)
 *  - layered illustration (3:9189 board, 3:9487 magnifier, 3:9680 alert card) floating at different
 *    depths + pointer parallax; Three.js particle globe glowing behind it.
 */
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "../gsap";
import { Container, PrimaryButton } from "../ui";
import { SplitReveal, Magnetic } from "../anim";
import { ParticleBackground } from "../three/particle-background";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEFX";

/** Stage = union of the three illustration layers: x 688.84→1440 (frame-clipped), y 209.52→769.6. */
const STAGE_W = 751.16;
const STAGE_H = 560.08;
const pctX = (v: number) => `${(v / STAGE_W) * 100}%`;
const pctY = (v: number) => `${(v / STAGE_H) * 100}%`;

function Glitch404() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      const main = root.querySelector<HTMLElement>("[data-main]")!;
      const layers = root.querySelectorAll<HTMLElement>("[data-ghost]");
      const finalText = "404";

      // 1) scramble-in: each char cycles random glyphs and locks in from left to right
      const state = { p: 0 };
      gsap.to(state, {
        p: 1,
        duration: 1.4,
        delay: 0.25,
        ease: "power2.out",
        onUpdate: () => {
          const locked = Math.floor(state.p * (finalText.length + 0.999));
          main.textContent = finalText
            .split("")
            .map((ch, i) => (i < locked ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join("");
        },
        onComplete: () => {
          main.textContent = finalText;
        },
      });
      gsap.from(main, { opacity: 0, filter: "blur(12px)", duration: 1, delay: 0.25 });

      // 2) periodic RGB-split glitch: two ghost copies jump with random clip slices
      const glitch = gsap.timeline({ repeat: -1, repeatDelay: 3.2, delay: 2.2 });
      for (let i = 0; i < 6; i++) {
        glitch.to(
          layers,
          {
            duration: 0.06,
            opacity: 1,
            x: (k: number) => (k === 0 ? 1 : -1) * gsap.utils.random(4, 12),
            clipPath: () => {
              const t = gsap.utils.random(0, 80);
              return `inset(${t}% 0 ${Math.max(0, 100 - t - gsap.utils.random(8, 26))}% 0)`;
            },
          },
          i * 0.07,
        );
        glitch.to(main, { duration: 0.06, x: gsap.utils.random(-3, 3), skewX: gsap.utils.random(-6, 6) }, i * 0.07);
      }
      glitch.to(layers, { duration: 0.08, opacity: 0, x: 0, clipPath: "inset(0% 0 100% 0)" });
      glitch.to(main, { duration: 0.08, x: 0, skewX: 0 }, "<");
    },
    { scope: ref },
  );
  const cls = "font-geist text-[clamp(140px,26vw,225.842px)] leading-[1.15] font-medium whitespace-nowrap select-none";
  return (
    <div ref={ref} aria-hidden className="relative">
      <span data-main className={`${cls} relative block text-cx-line`}>
        404
      </span>
      <span data-ghost className={`${cls} absolute inset-0 text-cx-accent/45 opacity-0 mix-blend-screen`}>
        404
      </span>
      <span data-ghost className={`${cls} absolute inset-0 text-white/20 opacity-0 mix-blend-screen`}>
        404
      </span>
    </div>
  );
}

function Illustration({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", el);
      // entrance: layers rise in from different depths
      gsap.from(layers, { y: (i: number) => 60 + i * 40, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.15, delay: 0.35 });
      // idle float (inner wrappers so it doesn't fight the pointer parallax)
      gsap.utils.toArray<HTMLElement>("[data-float]", el).forEach((f, i) => {
        gsap.to(f, { y: -[8, 16, 12][i], duration: [4.2, 3.1, 3.6][i], ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.4 });
      });
      if (!contextSafe || !window.matchMedia("(hover: hover)").matches) return;
      const depth = [10, 26, 40];
      const movers = layers.map((l, i) => ({
        x: gsap.quickTo(l, "x", { duration: 1, ease: "power3.out" }),
        y: gsap.quickTo(l, "y", { duration: 1, ease: "power3.out" }),
        d: depth[i],
      }));
      const onMove = contextSafe((e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * m.d);
          m.y(ny * m.d * 0.6);
        });
      });
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className} style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}>
      {/* Three.js particle globe glowing behind the illustration */}
      <div aria-hidden className="pointer-events-none absolute top-[-30%] left-[22%] aspect-square w-[95%]">
        <ParticleBackground variant="globe" color="#e12632" density={0.9} opacity={0.9} className="absolute inset-0" />
      </div>
      <div data-layer className="absolute will-change-transform" style={{ left: pctX(84.46), top: 0, width: pctX(667.04) }}>
        <div data-float>
          <Image src="/site/misc/404-board.webp" alt="" width={667} height={561} priority className="h-auto w-full" />
        </div>
      </div>
      <div data-layer className="absolute will-change-transform" style={{ left: 0, top: pctY(67.19), width: pctX(410.03) }}>
        <div data-float>
          <Image src="/site/misc/404-magnifier.webp" alt="" width={411} height={246} priority className="h-auto w-full" />
        </div>
      </div>
      <div data-layer className="absolute will-change-transform" style={{ left: pctX(475.37), top: pctY(135.89), width: pctX(275.79) }}>
        <div data-float>
          <Image src="/site/misc/404-alert-card.webp" alt="" width={276} height={219} priority className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}

export function NotFoundView() {
  const content = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-in]", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.12, delay: 0.55 });
      gsap.from("[data-bg]", { opacity: 0, scale: 1.04, duration: 1.8, ease: "power2.out" });
    },
    { scope: content },
  );
  return (
    <section ref={content} className="relative overflow-hidden xl:h-[938.57px]">
      {/* bg grid (Figma mask group, gradient-faded towards the top) */}
      <div data-bg aria-hidden className="pointer-events-none absolute top-0 left-1/2 h-[939px] w-[max(1440px,100%)] -translate-x-1/2">
        <Image src="/site/misc/404-grid-bg.webp" alt="" fill priority sizes="1440px" className="object-cover object-top" />
      </div>

      <Container className="relative flex min-h-full flex-col pt-[130px] pb-[64px] md:pt-[150px] xl:block xl:h-full xl:p-0">
        {/* Text column — 404 at (124, 261.71), content block at (125.5, 424.92) */}
        <div className="relative z-10 xl:absolute xl:top-[261.71px] xl:left-[-1.5px]">
          <Glitch404 />
        </div>
        <div className="relative z-10 -mt-[calc(clamp(140px,26vw,225.842px)*0.354)] max-w-[496px] xl:absolute xl:top-[424.92px] xl:left-0 xl:mt-0">
          <h1 className="pt-[16px] pb-[16px] font-geist text-[44px] leading-[1.15] font-medium text-white md:text-[60px]">
            <SplitReveal as="span" type="chars" immediate delay={0.4} className="block">
              Page not found
            </SplitReveal>
          </h1>
          <p data-in className="font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px] xl:h-[63px]">
            Lorem ipsum dolor sit amet consectetur. Id tortor dictum tellus euismod urna luctus fringilla amet nibh mattis.
          </p>
          <div data-in className="pt-[24px]">
            <Magnetic>
              <PrimaryButton href="/">Go back home</PrimaryButton>
            </Magnetic>
          </div>
        </div>

        {/* Illustration — stage left = 688.84 - 125.5 = 563.34 inside the container, top 209.52 */}
        <div
          className="relative mt-[48px] w-full max-w-[751px] self-center md:mt-[64px] xl:absolute xl:top-[209.52px] xl:left-[563.34px] xl:mt-0 xl:w-[751.16px] xl:max-w-none [mask-image:linear-gradient(to_right,#000_80%,transparent)] xl:max-[1440px]:[mask-image:none]"
        >
          <Illustration className="relative w-full" />
        </div>
      </Container>
    </section>
  );
}
