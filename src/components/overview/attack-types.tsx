"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Panel } from "@/components/shared/section";
import { useApp, type AlertCategory } from "@/lib/store";

const COLORS: Record<AlertCategory, string> = {
  Malware: "#c42a33",
  Phishing: "#d17a3f",
  Intrusion: "#c9a03c",
  "Brute force": "#3a9e94",
  DDoS: "#8d8d8d",
  "Data exfiltration": "#b8657f",
};

const config = Object.fromEntries(Object.entries(COLORS).map(([k, color]) => [k, { label: k, color }])) satisfies ChartConfig;

/** Donut of alert categories (all alerts in the store). */
export function AttackTypes() {
  const alerts = useApp((s) => s.alerts);
  const data = useMemo(() => {
    const counts = new Map<AlertCategory, number>();
    for (const a of alerts) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
    return [...counts].map(([category, value]) => ({ category, value })).sort((a, b) => b.value - a.value);
  }, [alerts]);
  const total = alerts.length;

  return (
    <Panel className="flex h-full flex-col gap-[16px] p-[18px] xl:p-[24px]">
      <div className="relative mx-auto aspect-square w-full max-w-[210px]">
        <ChartContainer config={config} className="aspect-square w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="category" hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="category" innerRadius="76%" outerRadius="100%" paddingAngle={2} stroke="none" animationDuration={900}>
              {data.map((d) => (
                <Cell key={d.category} fill={COLORS[d.category]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[30px] leading-none font-medium text-bd-primary">{total}</span>
          <span className="mt-[4px] text-[12px] text-bd-muted">alerts</span>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-x-[14px] gap-y-[8px]">
        {data.map((d) => (
          <li key={d.category} className="flex min-w-0 items-center gap-[8px] text-[12px] xl:text-[13px]">
            <span className="size-[9px] shrink-0 rounded-[2px]" style={{ background: COLORS[d.category] }} />
            <span className="truncate text-bd-muted">{d.category}</span>
            <span className="ml-auto text-bd-primary tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
