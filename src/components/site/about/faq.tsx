"use client";

/**
 * "Have a question?" — Figma 3:7509 (y 4441, 1188×876). Accordion: the open item is white with its answer,
 * closed items are #212121 (Neutrals/300). List 936.75 wide at x 125.6, 64px between items.
 */
import { useId, useRef, useState } from "react";
import { Container, SectionTag, A } from "@/components/site/ui";
import { SplitReveal, Reveal } from "@/components/site/anim";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";
import { cn } from "@/lib/utils";

const ANSWER =
  "Lorem ipsum dolor sit amet consectetur. Sem rhoncus ut nam vitae at et. Cursus donec at urna cras fermentum tempus pharetra vel tempus. Etiam commodo turpis elementum massa id quis.";

// qx: question x-offset per item, straight from Figma (number glyph widths differ)
const FAQS = [
  { q: "How can I get in touch with your cyber security experts?", qx: 63.75 },
  { q: "What types of cyber security services do you offer?", qx: 66.75 },
  { q: "What geographic regions do you serve?", qx: 66.75 },
  { q: "Is there a specific department I should address my inquiry to?", qx: 67.75 },
];

function Item({ i, q, qx, open, onToggle }: { i: number; q: string; qx: number; open: boolean; onToggle: () => void }) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  // initial height only — later changes are animated by GSAP, so React must not touch the inline style again
  const [initialOpen] = useState(open);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      if (first.current || prefersReducedMotion()) {
        first.current = false;
        gsap.set(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0 });
        return;
      }
      if (open) {
        gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.6, ease: "expo.out" });
        gsap.from(el.firstElementChild, { y: 12, duration: 0.6, ease: "expo.out" });
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.45, ease: "power3.inOut" });
      }
    },
    { dependencies: [open] },
  );

  const num = `${String(i + 1).padStart(2, "0")}/`;
  return (
    <li data-reveal>
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className={cn(
            "group flex w-full items-start gap-[12px] text-left font-geist text-[22px] leading-[1.25] font-medium transition-colors duration-500 md:gap-0 md:text-[30px] md:leading-[38px]",
            open ? "text-white" : "text-cx-line hover:text-[#5a5a5a] focus-visible:text-[#5a5a5a]",
            "outline-none focus-visible:underline focus-visible:decoration-cx-accent focus-visible:underline-offset-8",
          )}
        >
          <span className="shrink-0 md:w-[var(--qx)]" style={{ "--qx": `${qx}px` } as React.CSSProperties}>
            {num}
          </span>
          <span className="transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] md:group-hover:translate-x-[6px]">{q}</span>
        </button>
      </h3>
      <div ref={panel} id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} className="overflow-hidden" style={{ height: initialOpen ? "auto" : 0 }}>
        <p
          className="pt-[12px] font-geist text-[16px] leading-[1.5] text-cx-muted md:max-w-[calc(822.5px+var(--qx))] md:pt-[16px] md:pb-[6.85px] md:pl-[var(--ax)] md:text-[18px]"
          style={{ "--ax": `${qx - 1.75}px`, "--qx": `${qx - 1.75}px` } as React.CSSProperties}
        >
          {ANSWER}
        </p>
      </div>
    </li>
  );
}

export function AboutFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-[80px] md:mb-[40px] md:py-[100px] xl:mb-[120px] xl:py-[120px]">
      <Container>
        <div className="flex flex-col items-center pb-[48px] text-center">
          <SectionTag className="md:h-[23px]">Frequently asked questions</SectionTag>
          <div className="py-[16px]">
            <SplitReveal className="font-geist text-[34px] leading-[1.25] font-medium text-white md:text-[48px]">
              Have a <A>question?</A>
            </SplitReveal>
          </div>
          <Reveal as="p" className="max-w-[469px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]" delay={0.1}>
            Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit.
          </Reveal>
        </div>
        <Reveal as="ul" className="mx-auto flex max-w-[936.75px] flex-col gap-[40px] md:gap-[64px] xl:ml-[125.625px]" stagger={0.1}>
          {FAQS.map((f, i) => (
            <Item key={f.q} i={i} q={f.q} qx={f.qx} open={open === i} onToggle={() => setOpen((o) => (o === i ? -1 : i))} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
