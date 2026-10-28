"use client";

/**
 * Home V3 case studies — Figma `3:2298` (y 3181, 1188×983, pt/pb 120).
 * Animations: tag + heading line reveal, staggered card rise, pointer-following glow + border on hover.
 */
import Image from "next/image";
import Link from "next/link";
import { Reveal, SplitReveal } from "@/components/site/anim";
import { A, Container, SecondaryButton, SectionTag } from "@/components/site/ui";

const DESC = "Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc.";
const CASES = [
  { title: "Financial institution thwarts sophisticated phishing attack successfully", titleW: 271.441, author: "John Carter", avatar: "/site/home/avatar-2.webp" },
  { title: "Healthcare provider prevents data breach with advanced encryption measures", titleW: 284.441, author: "Sophie Moore", avatar: "/site/home/avatar-sophie.webp" },
  { title: "Retailer enhances network security amid rising cyber threats", titleW: 271.441, author: "Lilly Woods", avatar: "/site/home/avatar-lilly.webp" },
];

function CaseCard({ title, titleW, author, avatar }: (typeof CASES)[number]) {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div data-reveal className="h-full md:last:col-span-2 lg:last:col-span-1">
      <Link
        href="/about"
        onPointerMove={onMove}
        aria-label={`${title} — case study by ${author}`}
        className="group relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[8px] border border-cx-line bg-cx-bg px-[30.63px] pt-[40px] pb-[36.9px] transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[6px] hover:border-cx-accent/45 hover:shadow-[0_30px_80px_-40px_rgba(225,38,50,0.55)] focus-visible:outline-2 focus-visible:outline-cx-accent"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(225,38,50,0.18), transparent 65%)" }}
        />
        <div className="relative flex flex-col gap-[16px]">
          <h3 className="font-geist text-[20px] leading-[1.25] font-medium text-white xl:w-[var(--tw)]" style={{ ["--tw" as string]: `${titleW}px` }}>
            {title}
          </h3>
          <p className="font-geist text-[18px] leading-[1.5] text-cx-muted xl:h-[80px] xl:w-[284.441px]">{DESC}</p>
        </div>
        <div className="relative mt-auto flex items-center gap-[12px] pt-[32px]">
          <span className="relative size-[48px] shrink-0 overflow-hidden rounded-full bg-cx-accent transition-transform duration-500 group-hover:scale-110">
            <Image src={avatar} alt="" width={48} height={48} className="size-full" />
          </span>
          <p className="font-geist text-[18px] leading-[1.5] whitespace-nowrap text-white">by {author}</p>
        </div>
      </Link>
    </div>
  );
}

export function HomeCaseStudies() {
  return (
    <section aria-label="Case studies" className="relative py-[96px] md:py-[120px]">
      <Container className="flex max-w-[1188px] flex-col items-center">
        <div className="flex flex-col items-center pb-[48px] text-center">
          <Reveal y={16}>
            <SectionTag>Case studies</SectionTag>
          </Reveal>
          <div className="py-[16px]">
            <SplitReveal as="h2" className="font-geist text-[32px] leading-[1.25] font-medium text-white md:w-[789px] md:max-w-full md:text-[48px]">
              Discover how we had helped <br className="hidden md:block" />
              <A>world class companies</A> in the past
            </SplitReveal>
          </div>
          <Reveal y={20}>
            <p className="max-w-[469px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">
              Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit.
            </p>
          </Reveal>
        </div>

        <Reveal className="grid w-full grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3" stagger={0.14} y={70}>
          {CASES.map((c) => (
            <CaseCard key={c.author} {...c} />
          ))}
        </Reveal>

        <Reveal y={16} className="pt-[64px]">
          <SecondaryButton href="/about" className="px-0">
            Browse all case studies
          </SecondaryButton>
        </Reveal>
      </Container>
    </section>
  );
}
