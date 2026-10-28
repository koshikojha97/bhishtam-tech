"use client";

/**
 * FAQ list in the template's "Have a question?" style (About 3:7509):
 * "01/  Question" — Display/6 30px medium; open item white, closed items #212121 (hover → #bebebe);
 * answer = Paragraph Large 18/1.5 #bebebe indented under the question. Built on shadcn Accordion.
 */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, SectionTag } from "../ui";
import { Reveal, SplitReveal } from "../anim";

export type Faq = { q: string; a: string };

export function FaqSection({
  id,
  tag = "Frequently asked questions",
  title,
  intro,
  items,
}: {
  id?: string;
  tag?: string;
  title: React.ReactNode;
  intro: string;
  items: Faq[];
}) {
  return (
    <section id={id} className="scroll-mt-[95px] py-[80px] md:py-[120px]">
      <Container className="flex flex-col items-center">
        <div className="flex flex-col items-center pb-[40px] text-center md:pb-[48px]">
          <Reveal>
            <SectionTag>{tag}</SectionTag>
          </Reveal>
          <div className="py-[16px]">
            <SplitReveal className="font-geist text-[34px] leading-[1.25] font-medium text-white md:text-[48px]">{title}</SplitReveal>
          </div>
          <Reveal as="p" delay={0.1} className="max-w-[469px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">
            {intro}
          </Reveal>
        </div>

        <Reveal stagger={0.1} className="w-full max-w-[1000px]">
          <Accordion type="single" collapsible defaultValue="item-0" className="flex flex-col gap-[28px] md:gap-[48px] xl:gap-[64px]">
            {items.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} data-reveal className="group/item border-0">
                <AccordionTrigger className="items-start gap-[12px] rounded-[6px] p-0 font-geist text-[20px] leading-[1.25] font-medium text-cx-line no-underline transition-colors duration-300 hover:text-cx-muted hover:no-underline focus-visible:ring-cx-accent/40 data-[state=open]:text-white sm:text-[24px] md:gap-[24px] md:text-[30px] [&>svg]:hidden">
                  <span className="shrink-0">{String(i + 1).padStart(2, "0")}/</span>
                  <span className="flex-1 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/item:translate-x-[6px] group-data-[state=open]/item:translate-x-0">{f.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pt-[12px] pb-0 pl-[44px] font-geist text-[16px] leading-[1.5] text-cx-muted sm:pl-[52px] md:pt-[16.5px] md:pl-[62px] md:text-[18px]">
                  <p className="max-w-[822.5px]">{f.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
