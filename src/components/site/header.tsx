"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "./gsap";
import { SiteLogo } from "./logo";
import { PrimaryButton, SecondaryButton } from "./ui";
import { cn } from "@/lib/utils";

export const SITE_PAGES = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/contact", label: "Contact" },
];

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link href={href} className="group relative p-[4px] font-geist text-[18px] leading-[1.32] whitespace-nowrap text-white [text-shadow:0_4px_4px_rgba(0,0,0,0.25)]">
      <span className={cn("inline-block transition-[transform,color] duration-300 group-hover:-translate-x-[3px] group-hover:text-cx-accent", active && "text-cx-accent")}>[</span>
      <span className="mx-[5px]">{label}</span>
      <span className={cn("inline-block transition-[transform,color] duration-300 group-hover:translate-x-[3px] group-hover:text-cx-accent", active && "text-cx-accent")}>]</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState(false);

  // hide on scroll down, reveal on scroll up; solid backdrop after leaving the top
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.firstElementChild;
      if (!prefersReducedMotion() && inner) gsap.from(inner, { y: -40, opacity: 0, duration: 1, ease: "expo.out", delay: 0.1, clearProps: "transform,opacity" });
      const show = gsap.fromTo(el, { yPercent: 0 }, { yPercent: -110, paused: true, duration: 0.35, ease: "power2.inOut", immediateRender: false });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          el.dataset.scrolled = y > 40 ? "true" : "false";
          if (prefersReducedMotion()) return;
          if (self.direction === 1 && y > 200) show.play();
          else show.reverse();
        },
      });
    },
    { scope: ref },
  );

  return (
    <>
      <header
        ref={ref}
        data-scrolled="false"
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 data-[scrolled=true]:border-cx-line data-[scrolled=true]:bg-cx-bg/80 data-[scrolled=true]:backdrop-blur-xl"
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1189px] items-center justify-between px-[20px] md:h-[95px] md:px-[32px] xl:px-0">
          <SiteLogo />

          <nav aria-label="Main" className="hidden items-center gap-[16px] lg:flex">
            {SITE_PAGES.map((p) => (
              <NavLink key={p.href} href={p.href} label={p.label} active={p.href === pathname} />
            ))}
          </nav>

          <div className="hidden items-center gap-[16px] lg:flex">
            <SecondaryButton href="/login">Login</SecondaryButton>
            <PrimaryButton href="/contact">Get in touch</PrimaryButton>
          </div>

          <button type="button" aria-label="Open menu" onClick={() => setMenu(true)} className="rounded-[8px] border border-cx-line p-[10px] text-white lg:hidden">
            <Menu className="size-[20px]" />
          </button>
        </div>
      </header>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="right" className="w-full border-l-cx-line bg-cx-bg p-0 font-geist text-white sm:max-w-[380px] [&>button]:hidden">
          <div className="flex h-[72px] items-center justify-between border-b border-cx-line px-[20px]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">Site navigation</SheetDescription>
            <SiteLogo />
            <SheetClose className="rounded-[8px] border border-cx-line p-[10px]" aria-label="Close menu">
              <X className="size-[20px]" />
            </SheetClose>
          </div>
          <nav className="flex flex-col px-[20px] py-[24px]">
            {SITE_PAGES.map((p, i) => (
              <SheetClose asChild key={p.href}>
                <Link
                  href={p.href}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={cn(
                    "animate-in fade-in slide-in-from-right-4 fill-mode-both border-b border-cx-line py-[16px] text-[22px] font-medium duration-500",
                    p.href === pathname ? "text-cx-accent" : "text-white",
                  )}
                >
                  [ {p.label} ]
                </Link>
              </SheetClose>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-[12px] border-t border-cx-line p-[20px]">
            <SheetClose asChild>
              <PrimaryButton href="/contact" className="w-full">
                Get in touch
              </PrimaryButton>
            </SheetClose>
            <SheetClose asChild>
              <SecondaryButton href="/login" className="justify-center py-[10px]">
                Login
              </SecondaryButton>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
