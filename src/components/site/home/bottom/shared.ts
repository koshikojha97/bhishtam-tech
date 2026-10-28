/** Shared helpers for the Home (bottom) sections. */
import type { CSSProperties } from "react";

/** Figma "Display/8" section heading — 48/1.25 medium (scaled down below xl). */
export const H2 = "font-geist text-[32px] leading-[1.25] font-medium text-white md:text-[40px] xl:text-[48px]";
/** Figma "Paragraph Large" — 18/1.5 regular, #bebebe. */
export const P = "font-geist text-[16px] leading-[1.5] font-normal text-cx-muted md:text-[18px]";

/**
 * Absolute placement of a Figma layer inside a box of W×H, expressed in % so the
 * whole composition scales with its container (box keeps aspect-ratio W/H).
 */
export function place(x: number, y: number, w: number, W: number, H: number): CSSProperties {
  return { left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, width: `${(w / W) * 100}%` };
}

/** Illustration layers in Figma z-order, positioned inside the 1189×640 card. */
export const PROCESS_LAYERS = [
  { key: "shield", src: "/site/home/process-shield.webp", x: 880.6, y: 19.7, w: 308, h: 195.3 },
  { key: "dashboard", src: "/site/home/process-dashboard.webp", x: 190.6, y: 22.8, w: 878.4, h: 560.1 },
  { key: "gear", src: "/site/home/process-gear.webp", x: 32.8, y: 349.3, w: 300.3, h: 179.9 },
  { key: "tablet", src: "/site/home/process-tablet.webp", x: 328.4, y: 217.7, w: 514.9, h: 324.4 },
] as const;
