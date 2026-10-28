/**
 * Marketing-site primitives (Figma "Cybersecurity X" design system).
 * Container 1189px · Geist Mono (body) + Michroma (headings) · accent #e12632 · bg #010101 · lines #212121.
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Container({ className, children, as: As = "div" }: { className?: string; children: React.ReactNode; as?: React.ElementType }) {
  return <As className={cn("mx-auto w-full max-w-[1189px] px-[20px] md:px-[32px] xl:px-0", className)}>{children}</As>;
}

/** "// Our services //" label — Display/3/Medium 18px, #bebebe with accent slashes. */
export function SectionTag({ children, className, both = true }: { children: React.ReactNode; className?: string; both?: boolean }) {
  return (
    <p className={cn("font-geist text-[15px] leading-[1.25] font-medium text-cx-muted md:text-[18px]", className)}>
      <span className="text-cx-accent">{"//"}</span> {children} {both && <span className="text-cx-accent">{"//"}</span>}
    </p>
  );
}

/** Accent span for headings: <H>We are <A>experts</A></H> */
export function A({ children }: { children: React.ReactNode }) {
  return <span className="text-cx-accent">{children}</span>;
}

type BtnProps = { href: string; children: React.ReactNode; className?: string; onClick?: () => void; "aria-label"?: string };

/** White primary button — 18px medium, 12×24 padding, radius 8. */
export function PrimaryButton({ href, children, className, ...rest }: BtnProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center gap-[6px] overflow-hidden rounded-[8px] bg-white px-[20px] py-[10px] font-geist text-[16px] leading-[1.25] font-medium whitespace-nowrap text-cx-bg transition-transform duration-300 active:scale-[0.97] md:px-[24px] md:py-[12px] md:text-[18px]",
        className,
      )}
      {...rest}
    >
      <span className="absolute inset-0 origin-left scale-x-0 bg-cx-accent transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100" />
      <span className="relative transition-colors duration-300 group-hover:text-white">{children}</span>
    </Link>
  );
}

/** Text button with arrow — "Learn more →", "Login →". */
export function SecondaryButton({ href, children, className, ...rest }: BtnProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-[6px] px-[16px] font-geist text-[16px] leading-[1.25] font-medium whitespace-nowrap text-white md:text-[18px]", className)}
      {...rest}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">{children}</span>
      <ArrowRight className="size-[16px] transition-transform duration-300 group-hover:translate-x-[4px]" strokeWidth={1.6} />
    </Link>
  );
}

/** Thin bordered card used across sections (bg #0c0c0c, border #212121, radius 8). */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-[8px] border border-cx-line bg-cx-bg-2", className)}>{children}</div>;
}
