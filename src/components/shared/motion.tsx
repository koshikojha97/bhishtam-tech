"use client";

import { usePathname } from "next/navigation";
import { animate, motion, useInView, useMotionValue, useTransform, type HTMLMotionProps } from "framer-motion";
import { useEffect, useRef } from "react";

/** Fades/slides each route in. Keyed by pathname so it replays on navigation. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Parent that staggers its <FadeUp> children. */
export function Stagger({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" {...props}>
      {children}
    </motion.div>
  );
}

/** Child of <Stagger>, or standalone (plays on mount). */
export function FadeUp({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={item} {...props}>
      {children}
    </motion.div>
  );
}

/** Stagger for list rows (tables, alert lists). */
export const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
export const listItem = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/** Counts up a number when it scrolls into view. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) =>
    `${prefix}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`,
  );
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, value, { duration: 1.2, ease: "easeOut" });
    return () => c.stop();
  }, [inView, mv, value]);
  return <motion.span ref={ref} className={className}>{text}</motion.span>;
}
