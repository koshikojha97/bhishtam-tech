"use client";

/**
 * "Meet our amazing team" — Figma 3:7407 (y 2320.8, 1188×1022).
 * Left intro column 345 (sticky while the grid scrolls) · 59 gap · 2×2 grid of 380×380 cards (24 × 22 gaps).
 * Cards: cursor-follow accent glow, 3D tilt, avatar ring pulse, arrow nudge.
 */
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Container, SectionTag, A, PrimaryButton } from "@/components/site/ui";
import { SplitReveal, Reveal, Magnetic } from "@/components/site/anim";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";

const TEAM = [
  { name: "John Carter", role: "CEO & Founder", img: "team-john-carter" },
  { name: "Sophie Moore", role: "CTO & Co-founder", img: "team-sophie-moore" },
  { name: "Matt Cannon", role: "VP of Security", img: "team-matt-cannon" },
  { name: "Lilly Woods", role: "VP of Marketing", img: "team-lilly-woods" },
];

function TeamCard({ name, role, img }: (typeof TEAM)[number]) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe || prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) return;
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
      gsap.set(el, { transformPerspective: 900 });
      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
        ry((x - 0.5) * 8);
        rx(-(y - 0.5) * 8);
      });
      const leave = contextSafe(() => {
        rx(0);
        ry(0);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <Link
      ref={ref}
      href="/contact"
      aria-label={`${name}, ${role} — get in touch`}
      className="group relative block aspect-square w-full overflow-hidden rounded-[8px] border border-cx-line bg-cx-bg transition-colors duration-500 outline-none will-change-transform hover:border-[#2f2f2f] focus-visible:border-cx-accent md:aspect-auto md:h-[380px] xl:w-[380px]"
    >
      {/* cursor-follow glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(225,38,50,0.16), transparent 70%)" }}
      />
      {/* badge (20, 21.5) */}
      <span className="absolute top-[21.5px] left-[20px] rounded-[8px] bg-cx-accent px-[12px] py-[6px] font-geist text-[16px] leading-[1.25] font-medium whitespace-nowrap text-white md:text-[18px]">
        {role}
      </span>
      {/* external arrow (344.16, 21) */}
      <span aria-hidden className="absolute top-[21px] right-[15.84px] size-[20px] overflow-hidden">
        <Image
          src="/site/about/icons/arrow-external.svg"
          alt=""
          width={20}
          height={20}
          className="transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-[20px] group-hover:-translate-y-[20px]"
        />
        <Image
          src="/site/about/icons/arrow-external.svg"
          alt=""
          width={20}
          height={20}
          className="absolute top-0 left-0 -translate-x-[20px] translate-y-[20px] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-0 group-hover:translate-y-0"
        />
      </span>
      {/* content column — top 96, centred, 256 wide */}
      <span className="absolute inset-x-0 top-[22%] flex flex-col items-center gap-[16px] px-[20px] text-center md:top-[96px]">
        <span className="relative size-[80px]">
          <span aria-hidden className="absolute inset-0 rounded-full bg-cx-accent opacity-0 group-hover:animate-ping group-hover:opacity-40" />
          <Image
            src={`/site/about/${img}.webp`}
            alt={name}
            width={80}
            height={80}
            className="relative size-[80px] rounded-full transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.08]"
          />
        </span>
        <span className="font-geist text-[22px] leading-[1.25] font-medium whitespace-nowrap text-white md:text-[24px]">{name}</span>
        <span className="max-w-[256px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px] xl:h-[80px]">
          Lorem ipsum dolor sit amet consectetur. Nisl commodo erat quam metus.
        </span>
      </span>
    </Link>
  );
}

export function AboutTeam() {
  return (
    <section className="py-[80px] md:py-[100px] xl:py-[120px]">
      <Container>
        <div className="flex flex-col gap-[48px] xl:flex-row xl:items-start xl:gap-[59px]">
          <Reveal className="w-full xl:sticky xl:top-[140px] xl:w-[345px] xl:shrink-0">
            <div data-reveal>
              <SectionTag className="md:h-[23px]">Our team</SectionTag>
            </div>
            <div className="py-[16px]">
              <SplitReveal className="max-w-[345px] font-geist text-[34px] leading-[1.25] font-medium text-white md:text-[48px]">
                Meet our <A>amazing</A> team
              </SplitReveal>
            </div>
            <p data-reveal className="max-w-[345px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px] xl:h-[85px]">
              Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui. Tellus blandit morbi.
            </p>
            <div data-reveal className="flex pt-[24px]">
              <Magnetic strength={0.25}>
                <PrimaryButton href="/signup">Join us</PrimaryButton>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal
            className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 sm:gap-x-[24px] xl:w-[784px] xl:shrink-0"
            y={60}
            scale={0.94}
            stagger={0.12}
            start="top 80%"
          >
            {TEAM.map((m) => (
              <div key={m.name} data-reveal>
                <TeamCard {...m} />
              </div>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
