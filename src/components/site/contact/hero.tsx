"use client";

/**
 * Contact hero + info cards. Not in Figma — built from the template system (About hero layout:
 * tag → Display/10 heading with accent words → Paragraph Large → white + text buttons; Three.js
 * particle globe on the right where About has its globe illustration).
 */
import { useRef } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "../gsap";
import { A, Container, PrimaryButton, SecondaryButton, SectionTag } from "../ui";
import { Magnetic, Reveal, SplitReveal } from "../anim";
import { ParticleBackground } from "../three/particle-background";

const INFO = [
  { icon: Mail, label: "Email address", value: "info@cybersecurity.com", href: "mailto:info@cybersecurity.com", note: "We reply within 24 hours" },
  { icon: Phone, label: "Phone number", value: "(123) 456 - 7890", href: "tel:+11234567890", note: "Mon – Fri, 9am – 6pm" },
  {
    icon: MapPin,
    label: "Office address",
    value: "123 Security Ave, San Francisco, CA",
    href: "https://www.google.com/maps/search/?api=1&query=San+Francisco+CA",
    note: "Get directions",
  },
];

export function ContactHero() {
  const scope = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-globe]", { opacity: 0, scale: 0.85, duration: 2.2, ease: "expo.out", delay: 0.2 });
      gsap.to("[data-orbit]", { rotate: 360, duration: 60, ease: "none", repeat: -1 });
    },
    { scope },
  );
  return (
    <section ref={scope} className="relative overflow-hidden border-b border-cx-line pt-[130px] pb-[64px] md:pt-[180px] md:pb-[100px]">
      {/* globe (Three.js) */}
      <div
        data-globe
        aria-hidden
        className="pointer-events-none absolute top-[40px] right-[-45%] aspect-square w-[130%] opacity-50 sm:right-[-25%] sm:w-[90%] md:top-[30px] md:right-[-12%] md:w-[70%] md:opacity-100 xl:top-[40px] xl:right-[calc(50%-760px)] xl:w-[720px]"
      >
        <span data-orbit className="absolute inset-[6%] rounded-full border border-dashed border-cx-line" />
        <span className="absolute inset-[18%] rounded-full bg-cx-accent/10 blur-[80px]" />
        <ParticleBackground variant="globe" color="#e12632" density={1.1} opacity={1} className="absolute inset-0" />
      </div>

      <Container className="relative">
        <div className="max-w-[720px]">
          <Reveal y={20}>
            <SectionTag both={false}>Contact us</SectionTag>
          </Reveal>
          <div className="pt-[16px] pb-[16px]">
            <SplitReveal as="h1" immediate delay={0.15} className="font-geist text-[44px] leading-[1.15] font-medium text-white md:text-[60px] xl:text-[72px]">
              Get in <A>touch</A> with our security experts
            </SplitReveal>
          </div>
          <Reveal as="p" delay={0.35} y={20} className="max-w-[520px] font-geist text-[16px] leading-[1.5] text-cx-muted md:text-[18px]">
            Lorem ipsum dolor sit amet consectetur sagittis amet placerat elementum ornare eget amet massa egestas adipiscing est.
          </Reveal>
          <Reveal delay={0.45} y={20} className="flex flex-wrap items-center gap-[8px] pt-[24px]">
            <Magnetic>
              <PrimaryButton href="/contact#form">Send a message</PrimaryButton>
            </Magnetic>
            <SecondaryButton href="/contact#faq">Read the FAQ</SecondaryButton>
          </Reveal>
        </div>

        <Reveal stagger={0.12} delay={0.5} start="top 95%" className="grid grid-cols-1 gap-[16px] pt-[56px] md:grid-cols-3 md:gap-[24px] md:pt-[96px]">
          {INFO.map(({ icon: Icon, label, value, href, note }) => (
            <a
              key={label}
              data-reveal
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
              className="group relative flex flex-col overflow-hidden rounded-[8px] border border-cx-line bg-cx-bg-2/90 p-[24px] backdrop-blur-sm transition-[border-color,transform] duration-500 hover:-translate-y-[4px] hover:border-cx-accent/60 md:p-[32px]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(360px circle at var(--mx,50%) var(--my,0%), rgba(225,38,50,0.16), transparent 60%)" }}
              />
              <span className="relative flex items-start justify-between">
                <span className="flex size-[48px] items-center justify-center rounded-[8px] bg-cx-accent text-white transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                  <Icon className="size-[22px]" strokeWidth={1.8} />
                </span>
                <ArrowUpRight className="size-[20px] text-white transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" strokeWidth={1.6} />
              </span>
              <span className="relative pt-[32px] font-geist text-[16px] leading-[1.5] text-cx-subtle">{label}</span>
              <span className="relative pt-[4px] font-geist text-[20px] leading-[1.25] font-medium break-words text-white md:text-[20px] xl:text-[24px]">{value}</span>
              <span className="relative pt-[12px] font-geist text-[16px] leading-[1.5] text-cx-muted">{note}</span>
            </a>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
