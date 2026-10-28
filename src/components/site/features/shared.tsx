"use client";

/**
 * Features page helpers.
 *  - `box(W, H)` turns Figma px coordinates inside a W×H artboard into % styles,
 *    so illustrations keep their exact composition at 1440 and scale fluidly below.
 *  - `GlowCard` — card with a cursor-following accent border + spotlight (CSS vars, no re-render).
 *  - Icons exported from Figma as inline SVG (currentColor where they get animated).
 */
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const box =
  (W: number, H: number) =>
  (x: number, y: number, w: number, h?: number): React.CSSProperties => ({
    position: "absolute",
    left: `${(x / W) * 100}%`,
    top: `${(y / H) * 100}%`,
    width: `${(w / W) * 100}%`,
    height: h === undefined ? "auto" : `${(h / H) * 100}%`,
  });

export function GlowCard({ className, children, bg, bgSizes = "100vw" }: { className?: string; children: React.ReactNode; bg?: string; bgSizes?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      data-reveal
      className={cn("group/card relative isolate overflow-hidden rounded-[8px] bg-cx-bg [--mx:50%] [--my:50%]", className)}
    >
      {bg && (
        <Image src={bg} alt="" aria-hidden fill sizes={bgSizes} className="pointer-events-none -z-10 object-cover object-left-top" />
      )}
      {/* soft spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), rgba(225,38,50,0.10), transparent 55%)" }}
      />
      {/* static border (matches Figma #212121) */}
      <span aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[8px] border border-cx-line" />
      {/* cursor-follow accent border */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[8px] p-px opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background: "radial-gradient(240px circle at var(--mx) var(--my), rgba(225,38,50,1), rgba(225,38,50,0.25) 40%, transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </div>
  );
}

export function ExternalArrow({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path d="M6.30418 4.21519L16.01 3.98947L15.7842 13.6952M15.6469 4.19381L3.90967 15.931" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M10.0002 1.44275C14.7259 1.44294 18.5569 5.27467 18.5569 10.0004C18.5567 14.7259 14.7258 18.5568 10.0002 18.557C5.27455 18.557 1.44282 14.726 1.44263 10.0004C1.44263 5.27455 5.27443 1.44275 10.0002 1.44275ZM13.6829 6.73083C13.368 6.49465 12.9202 6.55873 12.6838 6.87341L9.12817 11.6127L7.24829 9.73279C6.96997 9.45476 6.51889 9.455 6.24048 9.73279C5.96209 10.0113 5.962 10.4632 6.24048 10.7416L8.70239 13.2025C8.84855 13.3486 9.05096 13.4242 9.25708 13.4095C9.46294 13.3948 9.65266 13.2914 9.77661 13.1263L13.8254 7.72888C14.061 7.41399 13.9974 6.96703 13.6829 6.73083Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden className={className}>
      <path
        d="M0 14.0543C0 18.3577 2.36086 20.0424 9.13533 23.7556C9.44415 23.9186 9.75392 24 9.96175 24C10.1696 24 10.489 23.9186 10.7882 23.7556C17.5723 20.052 19.9235 18.3577 19.9235 14.0543V5.13646C19.9235 3.73864 19.3821 3.24534 18.2116 2.74636C16.9004 2.2002 12.4804 0.64572 11.1947 0.206665C10.804 0.0813918 10.3579 0 9.96175 0C9.56565 0 9.11953 0.102861 8.73852 0.206665C7.45274 0.57376 3.02309 2.20987 1.71183 2.74636C0.551112 3.23566 0 3.73864 0 5.13646V14.0543ZM10.167 21.4822V2.24878C10.2769 2.25846 10.3902 2.29267 10.578 2.35353C12.1574 2.97424 15.5288 4.17367 17.3041 4.79886C17.6269 4.92107 17.7083 5.09683 17.7083 5.51275V13.6136C17.7083 17.0993 15.9752 18.0357 10.6422 21.2527C10.4482 21.3792 10.3001 21.4532 10.167 21.4822Z"
        fill="white"
      />
    </svg>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="white" />
      <path data-hand d="M12 5.37939V12.0001L15.3103 15.3104" stroke="#010101" strokeWidth="2" strokeLinecap="round" style={{ transformOrigin: "12px 12px" }} />
    </svg>
  );
}
