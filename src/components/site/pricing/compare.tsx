"use client";

/**
 * Plan comparison (id="compare").
 * Desktop/tablet (md+): shadcn Table parts with a sticky header row. The parts are rendered inside a plain
 * <table> (not shadcn's <Table> wrapper) because that wrapper is an overflow-x container, which would
 * stop `position: sticky` from sticking to the viewport.
 * Mobile: stacked rows (feature → 3 plan values in a 3-col grid) — no horizontal scroll.
 */
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { A, Container, SectionTag } from "../ui";
import { Reveal, SplitReveal } from "../anim";
import { COMPARE, PLANS, type Cell } from "./data";
import { cn } from "@/lib/utils";

function Value({ v, featured }: { v: Cell; featured?: boolean }) {
  if (v === true)
    return (
      <span className={cn("inline-flex size-[26px] items-center justify-center rounded-full", featured ? "bg-cx-accent text-white" : "bg-white text-cx-bg")}>
        <Check className="size-[15px]" strokeWidth={2.6} />
        <span className="sr-only">Included</span>
      </span>
    );
  if (v === false)
    return (
      <span className="inline-flex size-[26px] items-center justify-center text-[#3a3a3a]">
        <Minus className="size-[18px]" strokeWidth={2} />
        <span className="sr-only">Not included</span>
      </span>
    );
  return <span className={cn("font-geist text-[16px] leading-[1.32] lg:text-[18px]", featured ? "text-white" : "text-cx-muted")}>{v}</span>;
}

export function PricingCompare() {
  return (
    <section id="compare" className="scroll-mt-[40px] py-[80px] md:py-[120px]">
      <Container>
        <div className="flex flex-col items-center pb-[40px] text-center md:pb-[64px]">
          <Reveal>
            <SectionTag>Compare plans</SectionTag>
          </Reveal>
          <div className="py-[16px]">
            <SplitReveal className="font-geist text-[34px] leading-[1.25] font-medium text-white md:text-[48px]">
              Compare <A>features</A> across plans
            </SplitReveal>
          </div>
          <Reveal as="p" delay={0.1} className="max-w-[560px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">
            Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit.
          </Reveal>
        </div>

        {/* ---------- md+ : table ---------- */}
        <div className="hidden md:block">
          <table className="w-full table-fixed border-separate border-spacing-0 font-geist">
            <TableHeader className="[&_tr]:border-0">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="sticky top-0 z-10 h-auto w-[34%] border-b border-cx-line bg-cx-bg/85 px-[16px] py-[20px] align-bottom backdrop-blur-xl lg:w-[40%]">
                  <span className="text-[18px] leading-[1.25] font-medium text-cx-subtle">Features</span>
                </TableHead>
                {PLANS.map((p) => (
                  <TableHead
                    key={p.id}
                    className={cn(
                      "sticky top-0 z-10 h-auto border-b border-cx-line bg-cx-bg/85 px-[16px] py-[20px] text-center whitespace-normal backdrop-blur-xl",
                      p.featured && "bg-[#2a0609]/90 shadow-[inset_0_2px_0_#e12632]",
                    )}
                  >
                    <div className="text-[20px] leading-[1.25] font-medium text-white lg:text-[24px]">{p.name}</div>
                    <div className="pt-[4px] text-[16px] leading-[1.32] font-normal text-cx-subtle">from ${p.yearly}/mo</div>
                    <Link
                      href={`/signup?plan=${p.id}`}
                      className={cn(
                        "mt-[12px] inline-flex rounded-[6px] px-[14px] py-[8px] text-[15px] leading-[1.25] font-medium transition-colors",
                        p.featured ? "bg-white text-cx-bg hover:bg-cx-accent hover:text-white" : "border border-cx-line text-white hover:border-cx-accent hover:bg-cx-accent",
                      )}
                    >
                      Get started
                    </Link>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {COMPARE.map((g) => (
              <Reveal as="tbody" key={g.group} stagger={0.06} y={24} start="top 90%" className="[&_tr:last-child]:border-0">
                <TableRow data-reveal className="border-0 hover:bg-transparent">
                  <TableCell colSpan={4} className="border-b border-cx-line px-[16px] pt-[40px] pb-[14px]">
                    <SectionTag both={false} className="text-[16px] md:text-[16px]">
                      {g.group}
                    </SectionTag>
                  </TableCell>
                </TableRow>
                {g.rows.map((r) => (
                  <TableRow key={r.feature} data-reveal className="group/row border-0 transition-colors hover:bg-white/[0.02]">
                    <TableCell className="border-b border-cx-line px-[16px] py-[18px] text-[16px] leading-[1.32] whitespace-normal text-white lg:text-[18px]">
                      <span className="inline-block transition-transform duration-300 group-hover/row:translate-x-[4px]">{r.feature}</span>
                    </TableCell>
                    {r.values.map((v, i) => (
                      <TableCell key={i} className={cn("border-b border-cx-line px-[16px] py-[18px] text-center whitespace-normal", PLANS[i].featured && "bg-cx-accent/[0.05]")}>
                        <Value v={v} featured={PLANS[i].featured} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </Reveal>
            ))}
            <TableBody>
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell />
                {PLANS.map((p) => (
                  <TableCell key={p.id} className={cn("h-[24px] p-0", p.featured && "rounded-b-[8px] bg-cx-accent/[0.05]")} />
                ))}
              </TableRow>
            </TableBody>
          </table>
        </div>

        {/* ---------- mobile : stacked ---------- */}
        <div className="flex flex-col gap-[32px] md:hidden">
          {COMPARE.map((g) => (
            <Reveal key={g.group} stagger={0.06} y={20} start="top 92%">
              <SectionTag both={false} className="pb-[8px] text-[15px]">
                {g.group}
              </SectionTag>
              <div className="overflow-hidden rounded-[8px] border border-cx-line bg-cx-bg-2">
                {g.rows.map((r) => (
                  <div key={r.feature} data-reveal className="border-b border-cx-line p-[16px] last:border-0">
                    <p className="font-geist text-[16px] leading-[1.32] font-medium text-white">{r.feature}</p>
                    <dl className="grid grid-cols-3 gap-[8px] pt-[12px]">
                      {r.values.map((v, i) => (
                        <div key={i} className={cn("flex min-w-0 flex-col items-start gap-[6px] rounded-[6px] p-[8px]", PLANS[i].featured ? "bg-cx-accent/[0.08]" : "bg-cx-bg")}>
                          <dt className={cn("font-geist text-[12px] leading-[1.2] font-medium", PLANS[i].featured ? "text-cx-accent" : "text-cx-subtle")}>{PLANS[i].name}</dt>
                          <dd className="min-w-0 text-[14px] break-words [&_span]:text-[14px]">
                            <Value v={v} featured={PLANS[i].featured} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
