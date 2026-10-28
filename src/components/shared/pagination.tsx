"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Previous · 1 2 3 · Next. Pass a unique `layoutId` when two paginations share a page. */
export function Pagination({
  page,
  pages,
  onChange,
  className,
  layoutId = "page-active",
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
  className?: string;
  layoutId?: string;
}) {
  if (pages <= 1) return null;
  const btn = "flex items-center gap-[6px] text-[13px] font-medium text-bd-muted transition-colors hover:text-bd-primary disabled:pointer-events-none disabled:opacity-40 xl:text-[14px]";
  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-end gap-[4px]", className)}>
      <button type="button" className={cn(btn, "mr-[8px]")} disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="size-[16px]" />
        Previous
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
        const active = p === page;
        return (
          <button
            key={p}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onChange(p)}
            className={cn(
              "relative flex size-[32px] items-center justify-center text-[13px] font-medium transition-colors xl:size-[36px] xl:text-[14px]",
              active ? "text-white" : "text-bd-muted hover:text-bd-primary",
            )}
          >
            {active && (
              <motion.span layoutId={layoutId} transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-[8px] bg-bd-royal" />
            )}
            <span className="relative">{p}</span>
          </button>
        );
      })}
      <button type="button" className={cn(btn, "ml-[8px]")} disabled={page === pages} onClick={() => onChange(page + 1)}>
        Next
        <ChevronRight className="size-[16px]" />
      </button>
    </nav>
  );
}
