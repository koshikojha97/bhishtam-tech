"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Panel } from "@/components/shared/section";
import { listContainer, listItem } from "@/components/shared/motion";
import { SeverityBadge, StatusBadge, SEVERITY_TONE, toneBg, toneText } from "@/components/shared/security";
import { timeAgo, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Five newest alerts; each row deep-links into the Threats page search. */
export function RecentAlerts() {
  const alerts = useApp((s) => s.alerts);
  const latest = useMemo(() => [...alerts].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5), [alerts]);

  return (
    <Panel className="h-full p-[8px] xl:p-[10px]">
      <motion.ul variants={listContainer} initial="hidden" animate="show" className="flex flex-col">
        {latest.map((a) => (
          <motion.li key={a.id} variants={listItem}>
            <Link
              href={`/dashboard/threats?q=${encodeURIComponent(a.ref)}`}
              className="flex items-center gap-[12px] rounded-[6px] px-[10px] py-[11px] transition-colors hover:bg-bd-icon-light xl:gap-[14px] xl:px-[14px]"
            >
              <span className={cn("flex size-[40px] shrink-0 items-center justify-center rounded-[8px]", toneBg(SEVERITY_TONE[a.severity]), toneText(SEVERITY_TONE[a.severity]))}>
                <ShieldAlert className="size-[18px]" strokeWidth={1.7} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-bd-primary xl:text-[14px]">{a.title}</span>
                <span className="mt-[2px] block truncate text-[12px] text-bd-muted">
                  {a.ref} · {a.asset} · {timeAgo(a.date)}
                </span>
              </span>
              <span className="hidden shrink-0 sm:block">
                <StatusBadge status={a.status} />
              </span>
              <SeverityBadge severity={a.severity} className="shrink-0" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </Panel>
  );
}
