"use client";

import Link from "next/link";
import { SiteLogo } from "./logo";
import { Reveal } from "./anim";

/** Footer V1 (Figma 3:788). Links point to the site's real pages. */
const MAIN = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];
const UTILITY = [
  { label: "Login", href: "/login" },
  { label: "Sign up", href: "/signup" },
  { label: "404 not found", href: "/404" },
];

const linkCls = "relative w-fit font-geist text-[16px] leading-[1.25] font-medium text-cx-muted transition-colors duration-300 hover:text-white md:text-[18px] after:absolute after:-bottom-[3px] after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-cx-accent after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100";

export function SiteFooter() {
  return (
    <footer className="border-t border-cx-line bg-cx-bg font-geist text-white">
      <Reveal
        className="mx-auto grid w-full max-w-[1188px] gap-[48px] px-[20px] pt-[72px] pb-[48px] sm:grid-cols-2 md:px-[32px] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-[64px] lg:pt-[120px] lg:pb-[72px] xl:px-0"
        stagger={0.1}
      >
        <div data-reveal className="flex flex-col gap-[32px] sm:col-span-2 lg:col-span-1">
          <SiteLogo />
          <div className="flex flex-col gap-[16px]">
            <p className="text-[20px] leading-[1.25] font-medium">Contact us</p>
            <div className="flex flex-col gap-[16px] text-[18px]">
              <div className="flex flex-col gap-[4px]">
                <p className="leading-[1.32] text-cx-subtle">Email address</p>
                <a href="mailto:info@cybersecurity.com" className="w-fit leading-[1.25] font-medium hover:text-cx-accent">
                  info@cybersecurity.com
                </a>
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="leading-[1.32] text-cx-subtle">Phone number</p>
                <a href="tel:+11234567890" className="w-fit leading-[1.25] font-medium hover:text-cx-accent">
                  (123) 456 - 7890
                </a>
              </div>
            </div>
          </div>
        </div>

        <nav data-reveal aria-label="Main pages">
          <p className="text-[20px] leading-[1.25] font-medium">Main pages</p>
          <div className="flex flex-col gap-[16px] pt-[24px]">
            {MAIN.map((l) => (
              <Link key={l.label} href={l.href} className={linkCls}>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav data-reveal aria-label="Utility pages">
          <p className="text-[20px] leading-[1.25] font-medium">Utility pages</p>
          <div className="flex flex-col gap-[16px] pt-[24px]">
            {UTILITY.map((l) => (
              <Link key={l.label} href={l.href} className={linkCls}>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </Reveal>

      <div className="border-t border-cx-line">
        <p className="mx-auto w-full max-w-[1188px] px-[20px] py-[24px] text-[16px] leading-[1.43] text-cx-muted md:px-[32px] xl:px-0">
          Copyright © {new Date().getFullYear()} <span className="text-white">Bhishtam Tech</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
