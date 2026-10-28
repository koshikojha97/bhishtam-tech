"use client";

/** "Need a custom plan?" CTA — mirrors Home CTA (3:2334): 1189-wide bordered box with the server+lock art (3:2336). */
import Image from "next/image";
import { A, Container, PrimaryButton, SecondaryButton, SectionTag } from "../ui";
import { Magnetic, Parallax, Reveal, SplitReveal } from "../anim";

export function PricingCta() {
  return (
    <section className="pb-[80px] md:pb-[120px]">
      <Container>
        <Reveal y={60} scale={0.97} className="relative overflow-hidden rounded-[8px] border border-cx-line bg-cx-bg-2">
          <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,transparent_0%,#000_45%)] md:[mask-image:linear-gradient(to_right,transparent_5%,#000_40%)]">
            <Parallax y={-60} className="absolute inset-[-40px_0]">
              <Image src="/site/misc/cta-server-lock.webp" alt="" fill sizes="(min-width: 1280px) 1189px, 100vw" className="object-cover object-right opacity-30 md:opacity-100" />
            </Parallax>
          </div>
          <div className="relative flex min-h-[420px] flex-col justify-center px-[24px] py-[48px] md:min-h-[480px] md:px-[79px]">
            <SectionTag both={false}>Custom plans</SectionTag>
            <div className="py-[16px]">
              <SplitReveal className="max-w-[470px] font-geist text-[34px] leading-[1.25] font-medium text-white md:text-[48px]">
                Need a <A>custom</A> security plan?
              </SplitReveal>
            </div>
            <p className="max-w-[420px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">
              Lorem ipsum dolor sit amet consectetur. Eget nulla magna nulla dui dictumst. Nisl scelerisque augue.
            </p>
            <div className="flex flex-wrap items-center gap-[8px] pt-[24px]">
              <Magnetic>
                <PrimaryButton href="/contact#form">Contact sales</PrimaryButton>
              </Magnetic>
              <SecondaryButton href="/contact#faq">Read the FAQ</SecondaryButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
