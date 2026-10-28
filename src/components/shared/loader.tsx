/**
 * Theme loader: the logo mark inside a radar ring (rotating red sweep, pulse ring, scan line).
 * Pure markup + CSS keyframes (globals.css "Page loader"), so it animates before hydration and
 * works in server components (loading.tsx).
 */
import { cn } from "@/lib/utils";

export function LoaderMark({ size = 96, className }: { size?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("ldr", className)} style={{ width: size, height: size }}>
      <span className="ldr-pulse" />
      <span className="ldr-ring" />
      <span className="ldr-wedge" />
      <span className="ldr-arc" />
      <span className="ldr-core">
        {/* plain <img>: next/image would lazy-load and could show an empty core on first paint */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/site/brand/logo-mark.svg" alt="" width={300} height={300} />
        <span className="ldr-scan" />
      </span>
    </div>
  );
}

/** In-layout loader for loading.tsx while a route segment streams in. */
export function RouteLoader({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col items-center justify-center gap-[22px]", className)}>
      <LoaderMark size={84} />
      <p className="font-geist text-[13px] tracking-[0.18em] text-cx-muted uppercase">
        {label}
        <span className="ldr-dots" aria-hidden />
      </p>
    </div>
  );
}
