"use client";

/**
 * Home — Testimonials "What our clients say about us" (Figma 3:3170).
 * Carousel: dots, drag/swipe, arrow keys, 6s autoplay paused on hover/focus/hidden tab,
 * GSAP crossfade + slide between slides. Slide 1 = Figma copy; 2–3 reuse the exact Figma styles.
 */
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { A, Container, SectionTag } from "@/components/site/ui";
import { Reveal, SplitReveal } from "@/components/site/anim";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";
import { cn } from "@/lib/utils";
import { H2, P } from "./shared";

const SLIDES = [
  {
    name: "John Carter",
    role: "VP of Product",
    avatar: "/site/home/avatar-john-carter.webp",
    quote: "“Unparalleled expertise; our cyber defenses are impenetrable thanks to their stellar services.”",
  },
  {
    name: "Sophie Moore",
    role: "Head of IT",
    avatar: "/site/home/avatar-sophie-moore.webp",
    quote: "“Their proactive monitoring caught threats we never knew existed — our team finally sleeps at night.”",
  },
  {
    name: "Matt Cannon",
    role: "VP of Security",
    avatar: "/site/home/avatar-matt-cannon.webp",
    quote: "“Fast, reliable and remarkably thorough; they transformed how we approach security.”",
  },
];
const BODY = "Lorem ipsum dolor sit amet consectetur. Eget nulla magna odio eu dictumst. Nisl scelerisque augue urna hac etiam elit.";
const AUTOPLAY_MS = 6000;

export function HomeTestimonials() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const prev = useRef(0);
  const dir = useRef(1);
  const paused = useRef(false);
  const drag = useRef<{ x: number; id: number } | null>(null);

  const go = useCallback((next: number, d?: number) => {
    setIndex((cur) => {
      const n = (next + SLIDES.length) % SLIDES.length;
      if (n === cur) return cur;
      dir.current = d ?? (n > cur ? 1 : -1);
      return n;
    });
  }, []);

  // Animate slide change (crossfade + horizontal slide).
  const { contextSafe } = useGSAP({ scope: root });
  useEffect(() => {
    const el = track.current;
    if (!el || prev.current === index) return;
    const slides = el.querySelectorAll<HTMLElement>("[data-slide]");
    const from = slides[prev.current];
    const to = slides[index];
    prev.current = index;
    const animate = contextSafe(() => {
      if (prefersReducedMotion()) {
        gsap.set(from, { autoAlpha: 0 });
        gsap.set(to, { autoAlpha: 1, x: 0 });
        return;
      }
      const d = dir.current;
      gsap.killTweensOf([from, to]);
      gsap.to(from, { autoAlpha: 0, x: -60 * d, duration: 0.5, ease: "power2.in" });
      gsap.fromTo(to, { autoAlpha: 0, x: 60 * d }, { autoAlpha: 1, x: 0, duration: 0.9, delay: 0.25, ease: "expo.out" });
      gsap.fromTo(to.querySelectorAll("[data-stagger]"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.3, stagger: 0.08, ease: "expo.out" });
    });
    animate();
  }, [index, contextSafe]);

  // Autoplay (restarts after each change; paused on hover/focus/hidden tab/off-screen).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let timer = 0;
    const tick = () => {
      if (!paused.current && document.visibilityState === "visible") go(index + 1, 1);
      else timer = window.setTimeout(tick, 800);
    };
    timer = window.setTimeout(tick, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, go]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !track.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6) track.current.style.transform = `translateX(${dx * 0.25}px)`;
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current || !track.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    gsap.to(track.current, { x: 0, duration: 0.5, ease: "expo.out", clearProps: "transform" });
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  };

  return (
    <section ref={root} aria-labelledby="home-testimonials-title" className="pt-[64px] pb-[64px] md:pt-[96px] md:pb-[96px] xl:pt-[120px] xl:pb-[120px]">
      <Container>
        {/* header */}
        <div className="mx-auto flex max-w-[730px] flex-col items-center pb-[40px] text-center md:pb-[64px]">
          <SectionTag>Testimonials</SectionTag>
          <SplitReveal as="h2" className={`${H2} py-[16px]`}>
            <span id="home-testimonials-title">
              What our clients say <A>about us</A>
            </span>
          </SplitReveal>
          <Reveal y={24}>
            <p className={`${P} max-w-[500px]`}>Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit.</p>
          </Reveal>
        </div>

        <Reveal y={50}>
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(index + 1, 1);
              if (e.key === "ArrowLeft") go(index - 1, -1);
            }}
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
            onFocus={() => (paused.current = true)}
            onBlur={() => (paused.current = false)}
            className="mx-auto max-w-[839px] rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-cx-accent"
          >
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={(e) => drag.current && endDrag(e)}
              className="relative cursor-grab touch-pan-y overflow-hidden rounded-[8px] border border-cx-line bg-cx-bg select-none active:cursor-grabbing md:h-[340px]"
            >
              <div ref={track} className="grid h-full">
                {SLIDES.map((s, i) => (
                  <figure
                    key={s.name}
                    data-slide
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${SLIDES.length}`}
                    aria-hidden={i !== index}
                    className={cn(
                      "col-start-1 row-start-1 flex items-center px-[24px] py-[32px] md:px-[48px] md:py-0 xl:px-[76px]",
                      i === 0 ? "visible opacity-100" : "invisible opacity-0",
                    )}
                  >
                    <div className="flex w-full flex-col gap-[24px] md:flex-row md:items-start md:gap-[48px] xl:gap-[80px]">
                    <figcaption data-stagger className="flex shrink-0 items-center gap-[24px] md:min-w-[207px]">
                      <Image src={s.avatar} alt={s.name} width={64} height={64} unoptimized className="size-[64px] rounded-full" draggable={false} />
                      <span className="flex flex-col gap-[5px] font-geist text-[18px] leading-[1.25] font-medium">
                        <span className="text-white">{s.name}</span>
                        <span className="text-cx-subtle">{s.role}</span>
                      </span>
                    </figcaption>
                    <blockquote className="flex max-w-[400px] flex-col gap-[16px]">
                      <p data-stagger className="font-geist text-[20px] leading-[1.25] font-medium text-white md:text-[24px]">
                        {s.quote}
                      </p>
                      <p data-stagger className={P}>
                        {BODY}
                      </p>
                    </blockquote>
                    </div>
                  </figure>
                ))}
              </div>
            </div>

            {/* dots */}
            <div className="flex justify-center gap-[10px] pt-[24px]" role="tablist" aria-label="Choose testimonial">
              {SLIDES.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial ${i + 1}: ${s.name}`}
                  onClick={() => go(i)}
                  className="group relative grid size-[10px] cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cx-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cx-bg"
                >
                  <span className="absolute -inset-[7px]" />
                  <span
                    className={cn(
                      "size-[10px] rounded-full transition-[background-color,transform] duration-500 group-hover:scale-125",
                      i === index ? "bg-cx-accent" : "bg-[#f1f3f7]",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
