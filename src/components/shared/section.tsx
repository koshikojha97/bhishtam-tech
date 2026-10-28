"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FadeUp } from "./motion";

/** Section heading (Michroma, like the site) with optional right-side action, e.g. "See All". */
export function Section({
  title,
  action,
  actionHref = "#",
  className,
  children,
  id,
}: {
  title: string;
  action?: string;
  actionHref?: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <FadeUp id={id} className={cn("flex min-w-0 scroll-mt-[120px] flex-col", className)}>
      <div className="mb-[15px] flex items-center justify-between lg:mb-[18px] xl:mb-[20px]">
        <h2 className="text-[15px] leading-normal text-bd-primary lg:text-[16px] xl:text-[18px]">{title}</h2>
        {action && (
          <Link
            href={actionHref}
            className="group inline-flex items-center gap-[6px] text-[13px] font-medium text-bd-muted transition-colors hover:text-bd-primary xl:text-[14px]"
          >
            {action}
            <span aria-hidden className="text-bd-royal transition-transform duration-300 group-hover:translate-x-[3px]">→</span>
          </Link>
        )}
      </div>
      {children}
    </FadeUp>
  );
}

/** Site-style card: #0c0c0c surface, #212121 border, radius 8; border lightens on hover. */
export function Panel({ className, children, hover = true }: { className?: string; children: React.ReactNode; hover?: boolean }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn("rounded-[8px] border border-bd-border bg-bd-surface transition-colors", hover && "hover:border-bd-card-border", className)}
    >
      {children}
    </motion.div>
  );
}
