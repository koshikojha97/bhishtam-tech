"use client";

/**
 * Pricing hero + monthly/yearly toggle + 3 plan cards.
 * Not in Figma — built from the template's system: SectionTag, Display/10 heading, Paragraph Large,
 * #0c0c0c cards with #212121 borders (r 8), accent Badge (r 8, 6×12), white primary buttons.
 * Animations: SplitText hero, cards stagger in with 3D tilt-in, cursor-follow card glow,
 * odometer-style GSAP digit flip on price change, idle-floating isometric art.
 */
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { gsap, useGSAP, prefersReducedMotion } from "../gsap";
import { A, Container, SectionTag } from "../ui";
import { Float, Reveal, SplitReveal } from "../anim";
import { PLANS, type Billing, type Plan } from "./data";
import { cn } from "@/lib/utils";

/** Digit-by-digit flip: old digits roll up and out, new ones roll in from below. */
function PriceFlip({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const [old, setOld] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (prev.current === value) return;
    setOld(prev.current);
    prev.current = value;
  }, [value]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || old === null) return;
      if (prefersReducedMotion()) {
        setOld(null);
        return;
      }
      const tl = gsap.timeline({ onComplete: () => setOld(null) });
      tl.to(el.querySelectorAll("[data-old] span"), { yPercent: -100, opacity: 0, duration: 0.35, ease: "power3.in", stagger: 0.04 }).fromTo(
        el.querySelectorAll("[data-new] span"),
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.05 },
        0.12,
      );
    },
    { scope: ref, dependencies: [old] },
  );

  const digits = (n: number) =>
    String(n)
      .split("")
      .map((d, i) => (
        <span key={i} className="inline-block">
          {d}
        </span>
      ));

  return (
    <span ref={ref} className={cn("relative inline-flex overflow-hidden", className)} aria-live="polite">
      <span data-new className="inline-flex">
        {digits(value)}
      </span>
      {old !== null && (
        <span data-old aria-hidden className="absolute inset-0 inline-flex">
          {digits(old)}
        </span>
      )}
    </span>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const price = billing === "monthly" ? plan.monthly : plan.yearly;
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      data-reveal
      onPointerMove={onMove}
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-[8px] border bg-cx-bg-2 p-[24px] transition-[border-color,transform] duration-500 hover:-translate-y-[4px] md:p-[32px]",
        plan.featured ? "border-cx-accent shadow-[0_0_0_1px_rgba(225,38,50,0.35),0_30px_120px_-30px_rgba(225,38,50,0.55)]" : "border-cx-line hover:border-[#2e2e2e]",
      )}
    >
      {/* cursor-follow glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,0%), rgba(225,38,50,0.14), transparent 60%)" }}
      />
      {plan.featured && <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[180px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(225,38,50,0.22),transparent)]" />}

      <div className="relative flex items-start justify-between gap-[16px]">
        <div className="flex h-[144px] items-end">
          <Float y={8} duration={3 + PLANS.indexOf(plan) * 0.4} delay={PLANS.indexOf(plan) * 0.3}>
            <Image src={plan.art.src} alt="" width={plan.art.w} height={plan.art.h} className="h-auto w-auto max-w-none" style={{ width: plan.art.w, height: plan.art.h }} />
          </Float>
        </div>
        {plan.featured && (
          <span className="rounded-[8px] bg-cx-accent px-[12px] py-[6px] font-geist text-[14px] leading-[1.25] font-medium whitespace-nowrap text-white md:text-[16px]">Most popular</span>
        )}
      </div>

      <h3 className="relative pt-[32px] font-geist text-[24px] leading-[1.25] font-medium text-white">{plan.name}</h3>
      <p className="relative pt-[8px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">{plan.tagline}</p>

      <div className="relative mt-[24px] border-t border-cx-line pt-[24px]">
        <div className="flex items-end gap-[6px] font-geist text-white">
          <span className="pb-[8px] text-[30px] leading-[1.25] font-medium">$</span>
          <PriceFlip value={price} className="text-[60px] leading-[1.15] font-medium tabular-nums" />
          <span className="pb-[10px] text-[18px] leading-[1.32] text-cx-muted">/month</span>
        </div>
        <p className="pt-[4px] font-geist text-[16px] leading-[1.5] text-cx-subtle">
          {billing === "yearly" ? `Billed $${price * 12} yearly` : "Billed monthly, cancel anytime"}
        </p>
      </div>

      <Link
        href={`/signup?plan=${plan.id}`}
        className={cn(
          "group/btn relative mt-[24px] inline-flex items-center justify-center gap-[6px] overflow-hidden rounded-[8px] px-[24px] py-[12px] font-geist text-[18px] leading-[1.25] font-medium transition-transform active:scale-[0.98]",
          plan.featured ? "bg-white text-cx-bg" : "border border-cx-line bg-cx-bg text-white",
        )}
      >
        <span className={cn("absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/btn:scale-x-100", "bg-cx-accent")} />
        <span className="relative transition-colors duration-300 group-hover/btn:text-white">Get started</span>
        <ArrowRight className="relative size-[16px] transition-[transform,color] duration-300 group-hover/btn:translate-x-[3px] group-hover/btn:text-white" strokeWidth={1.8} />
      </Link>

      <ul className="relative flex flex-col gap-[14px] pt-[32px]">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-[10px] font-geist text-[16px] leading-[1.32] text-white md:text-[18px]">
            <CircleCheck className={cn("mt-[2px] size-[20px] shrink-0", plan.featured ? "text-cx-accent" : "text-white")} strokeWidth={1.8} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const yearly = billing === "yearly";
  const cards = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-reveal]", {
        y: 80,
        rotateX: 12,
        opacity: 0,
        transformPerspective: 1200,
        transformOrigin: "50% 100%",
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.5,
        clearProps: "transform",
      });
      gsap.from("[data-bg]", { opacity: 0, duration: 2, ease: "power2.out" });
    },
    { scope: cards },
  );

  return (
    <section ref={cards} className="relative overflow-hidden pt-[130px] pb-[80px] md:pt-[159px] md:pb-[120px]">
      {/* isometric grid backdrop, faded at top and bottom */}
      <div data-bg aria-hidden className="pointer-events-none absolute top-[180px] left-1/2 h-[939px] w-[max(1440px,100%)] -translate-x-1/2 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
        <Image src="/site/misc/404-grid-bg.webp" alt="" fill sizes="1440px" className="object-cover object-top" />
      </div>

      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <Reveal y={20}>
            <SectionTag>Pricing</SectionTag>
          </Reveal>
          <div className="pt-[16px] pb-[24px]">
            <SplitReveal as="h1" immediate delay={0.2} className="max-w-[1001px] font-geist text-[40px] leading-[1.15] font-medium text-white md:text-[56px] xl:text-[72px]">
              Simple pricing for <A>every</A> security need
            </SplitReveal>
          </div>
          <Reveal as="p" delay={0.35} y={20} className="max-w-[560px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">
            Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit. Nisl commodo erat quam metus.
          </Reveal>

          {/* Billing toggle */}
          <Reveal delay={0.45} y={20} className="pt-[32px]">
            <div className="inline-flex items-center gap-[14px] rounded-[8px] border border-cx-line bg-cx-bg-2 px-[16px] py-[10px] font-geist text-[16px] leading-[1.25] font-medium md:text-[18px]">
              <button type="button" onClick={() => setBilling("monthly")} className={cn("transition-colors", yearly ? "text-cx-subtle hover:text-white" : "text-white")}>
                Monthly
              </button>
              <Switch
                checked={yearly}
                onCheckedChange={(c) => setBilling(c ? "yearly" : "monthly")}
                aria-label="Bill yearly"
                className="h-[24px] w-[44px] border-cx-line data-[state=checked]:bg-cx-accent data-[state=unchecked]:bg-cx-line [&>span]:size-[18px] [&>span]:bg-white [&>span]:data-[state=checked]:translate-x-[21px] [&>span]:data-[state=unchecked]:translate-x-[2px]"
              />
              <button type="button" onClick={() => setBilling("yearly")} className={cn("transition-colors", yearly ? "text-white" : "text-cx-subtle hover:text-white")}>
                Yearly
              </button>
              <span
                className={cn(
                  "rounded-[8px] px-[10px] py-[4px] text-[14px] transition-[background-color,color] duration-500 md:text-[15px]",
                  yearly ? "bg-cx-accent text-white" : "bg-cx-line text-cx-muted",
                )}
              >
                Save 20%
              </span>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-[24px] pt-[48px] md:grid-cols-2 md:pt-[64px] xl:grid-cols-3 xl:gap-[24.5px]">
          {PLANS.map((p) => (
            <div key={p.id} className={cn(p.featured && "md:order-first xl:order-none", "md:last:col-span-2 xl:last:col-span-1")}>
              <PlanCard plan={p} billing={billing} />
            </div>
          ))}
        </div>

        <Reveal y={20} className="flex justify-center pt-[40px]">
          <Link href="/pricing#compare" className="group inline-flex items-center gap-[6px] font-geist text-[18px] leading-[1.25] font-medium text-white">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
              Compare all features
            </span>
            <ArrowRight className="size-[16px] rotate-90 transition-transform duration-300 group-hover:translate-y-[3px]" strokeWidth={1.6} />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
