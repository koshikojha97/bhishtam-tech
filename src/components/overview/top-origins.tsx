"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { Panel } from "@/components/shared/section";
import { useApp } from "@/lib/store";

/** Where attacks come from, by alert source country (internal / global excluded). */
export function TopOrigins() {
  const alerts = useApp((s) => s.alerts);
  const rows = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of alerts) if (a.country !== "Internal" && a.country !== "Global") counts.set(a.country, (counts.get(a.country) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [alerts]);
  const max = rows[0]?.[1] ?? 1;

  return (
    <Panel className="flex h-full flex-col gap-[14px] p-[18px] xl:p-[24px]">
      <ul className="flex flex-col gap-[14px]">
        {rows.map(([country, n], i) => (
          <li key={country} className="flex flex-col gap-[6px]">
            <span className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-[8px] text-bd-text">
                <Globe2 className="size-[14px] text-bd-muted" strokeWidth={1.7} />
                {country}
              </span>
              <span className="text-bd-muted tabular-nums">
                {n} {n === 1 ? "attack" : "attacks"}
              </span>
            </span>
            <span className="h-[6px] overflow-hidden rounded-full bg-bd-input">
              <motion.span
                className="block h-full rounded-full bg-bd-royal"
                initial={{ width: 0 }}
                animate={{ width: `${(n / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
              />
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
