"use client";

/**
 * Home — Process "How does it works" (Figma 3:4393).
 * Illustration layers parallax-scrub with scroll, the four steps highlight one-by-one as the
 * user scrolls past them, and the play button opens a dialog with an animated "video" scene.
 */
import Image from "next/image";
import { useRef, useState } from "react";
import { A, Container, PrimaryButton, SectionTag } from "@/components/site/ui";
import { Magnetic, SplitReveal } from "@/components/site/anim";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/components/site/gsap";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { H2, P, PROCESS_LAYERS, place } from "./shared";
import { ProcessVideo } from "./process-video";

const W = 1189;
const H = 640;


const STEPS = [
  { n: "01/", title: "Create an account", w: 213 },
  { n: "02/", title: "Install our firewall", w: 200 },
  { n: "03/", title: "Setup your network", w: 227 },
  { n: "04/", title: "Be protected", w: 225 },
];
/** Static (no-JS / reduced-motion) state = Figma: steps 02 & 03 have white copy. */
const STATIC_STATE = ["idle", "done", "done", "idle"] as const;

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 94 94" fill="none" aria-hidden className={className}>
      <circle cx="47" cy="47" r="47" fill="#e12632" />
      <path
        d="M62.9648 46.0804C64.2982 46.8502 64.2982 48.7747 62.9648 49.5445L40.5176 62.5045C39.1842 63.2743 37.5176 62.312 37.5176 60.7724L37.5176 34.8526C37.5176 33.313 39.1842 32.3507 40.5176 33.1205L62.9648 46.0804Z"
        fill="white"
      />
    </svg>
  );
}

export function HomeProcess() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);
      const card = q("[data-process-card]")[0] as HTMLElement;

      // Entrance — card rises, layers assemble, play button pops.
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none none" }, defaults: { ease: "expo.out" } });
      tl.from(card, { y: 60, opacity: 0, duration: 1.1 })
        .from(q("[data-layer-in]"), { yPercent: 14, opacity: 0, duration: 1.4, stagger: 0.12 }, 0.15)
        .from(q("[data-play]"), { scale: 0, duration: 0.9, ease: "back.out(2)" }, 0.7);

      // Idle pulse ring on the play button.
      gsap.fromTo(q("[data-play-ring]"), { scale: 1, opacity: 0.55 }, { scale: 1.7, opacity: 0, duration: 2, ease: "power2.out", repeat: -1, stagger: 1 });

      // Scroll scrub — each layer drifts at its own depth.
      const depth: Record<string, [number, number, number]> = {
        shield: [0, 22, -18],
        dashboard: [0, 7, -7],
        gear: [-6, 24, -20],
        tablet: [-3, 16, -12],
      };
      q("[data-layer]").forEach((node) => {
        const [x, y0, y1] = depth[(node as HTMLElement).dataset.layer!] ?? [0, 0, 0];
        gsap.fromTo(node, { yPercent: y0, xPercent: x }, { yPercent: y1, xPercent: -x, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 } });
      });

      // Steps — reveal, then highlight sequentially with scroll progress.
      const steps = q("[data-step]") as HTMLElement[];
      gsap.from(steps, { y: 40, opacity: 0, duration: 1, stagger: 0.12, scrollTrigger: { trigger: steps[0], start: "top 92%", toggleActions: "play none none none" } });
      const setActive = (p: number) => {
        const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
        steps.forEach((s, i) => (s.dataset.state = i < idx ? "done" : i === idx ? (p >= 1 ? "done" : "current") : "idle"));
      };
      const st = ScrollTrigger.create({
        trigger: q("[data-steps]")[0],
        start: "top 88%",
        end: "top 32%",
        onUpdate: (self) => setActive(self.progress),
        onRefresh: (self) => setActive(self.progress),
      });
      setActive(st.progress);
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="home-process-title" className="pt-[64px] pb-[64px] md:pt-[96px] md:pb-[96px] xl:pt-[120px] xl:pb-[120px]">
      <Container>
        {/* header */}
        <div className="flex flex-col gap-[24px] pb-[32px] md:flex-row md:items-end md:justify-between md:gap-0 md:pb-[48px]">
          <div className="flex max-w-[695px] flex-col">
            <SectionTag>Our process</SectionTag>
            <SplitReveal as="h2" className={`${H2} pt-[16px]`}>
              <span id="home-process-title">
                How does it <A>works</A>
              </span>
            </SplitReveal>
          </div>
          <div className="md:pt-[24px]">
            <Magnetic strength={0.25}>
              <PrimaryButton href="/signup">Get started</PrimaryButton>
            </Magnetic>
          </div>
        </div>

        {/* illustration card */}
        <div
          data-process-card
          className="group/card relative isolate overflow-hidden rounded-[8px] bg-cx-bg"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          <Image src="/site/home/card-grid-bg.webp" alt="" fill unoptimized sizes="1189px" className="pointer-events-none -z-10 object-cover object-left-top select-none" />
          {PROCESS_LAYERS.map((l) => (
            <div key={l.key} data-layer-in className="pointer-events-none absolute select-none" style={place(l.x, l.y, l.w, W, H)}>
              <div data-layer={l.key}>
                <Image src={l.src} alt="" width={Math.round(l.w)} height={Math.round(l.h)} unoptimized className="h-auto w-full" />
              </div>
            </div>
          ))}
          {/* Figma 3:5218 — #010101 @ 70% dims the illustration */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-cx-bg/70 transition-colors duration-700 group-hover/card:bg-cx-bg/55" />
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[8px] border border-cx-line" />

          <button
            type="button"
            data-play
            onClick={() => setOpen(true)}
            aria-label="Play video: how Bhishtam Tech works"
            className="absolute z-10 grid aspect-square w-[56px] -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-cx-bg md:w-[72px] xl:w-[94px]"
            style={{ left: `${((547.3 + 47) / W) * 100}%`, top: `${((273 + 47) / H) * 100}%` }}
          >
            <span data-play-ring className="absolute inset-0 rounded-full border border-cx-accent" />
            <span data-play-ring className="absolute inset-0 rounded-full border border-cx-accent" />
            <PlayIcon className="relative size-full transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/card:scale-[1.08]" />
          </button>
        </div>

        {/* steps */}
        <ol
          data-steps
          className="grid grid-cols-1 gap-y-[40px] pt-[40px] sm:grid-cols-2 sm:gap-x-[32px] md:pt-[48px] xl:grid-cols-[213px_200px_227px_225px] xl:gap-x-[108px]"
        >
          {STEPS.map((s, i) => (
            <li key={s.n} data-step data-state={STATIC_STATE[i]} className="group flex flex-col items-center gap-[16px] text-center">
              <span className="font-geist text-[24px] leading-[1.25] font-medium text-white transition-colors duration-500 group-data-[state=current]:text-cx-accent">{s.n}</span>
              <div className="flex flex-col gap-[16px]">
                <h3 className="font-geist text-[20px] leading-[1.25] font-medium text-white md:text-[24px]">{s.title}</h3>
                <p className={`${P} mx-auto max-w-[260px] transition-colors duration-500 group-data-[state=current]:text-white group-data-[state=done]:text-white xl:min-h-[84px] xl:max-w-none`}>
                  Lorem ipsum dolor sit amet consectetur eget nulla magna odio eu.
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100%-32px)] gap-0 overflow-hidden border-cx-line bg-cx-bg-2 p-0 text-white sm:max-w-[960px] [&>button]:z-20 [&>button]:text-white">
          <DialogTitle className="sr-only">How Bhishtam Tech works</DialogTitle>
          <DialogDescription className="sr-only">An animated walkthrough of the four steps: create an account, install our firewall, setup your network, be protected.</DialogDescription>
          {open && <ProcessVideo />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
