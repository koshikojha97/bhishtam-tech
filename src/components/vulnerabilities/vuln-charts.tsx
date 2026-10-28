"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Panel } from "@/components/shared/section";
import { SEVERITY_COLOR } from "@/components/shared/security";
import { SEVERITIES, useApp } from "@/lib/store";

const sevConfig = { count: { label: "Open" } } satisfies ChartConfig;

/** Horizontal bars: unpatched vulnerabilities per severity. */
export function OpenBySeverity() {
  const vulns = useApp((s) => s.vulnerabilities);
  const data = useMemo(
    () => SEVERITIES.map((severity) => ({ severity, count: vulns.filter((v) => v.severity === severity && v.status !== "Patched").length })),
    [vulns],
  );
  return (
    <Panel className="h-full px-[16px] pt-[20px] pb-[12px] xl:px-[22px] xl:pt-[24px]">
      <ChartContainer config={sevConfig} className="aspect-auto h-[230px] w-full xl:h-[250px]">
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }} barCategoryGap="28%">
          <CartesianGrid horizontal={false} stroke="var(--color-bd-grid)" />
          <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <YAxis type="category" dataKey="severity" width={70} tickLine={false} axisLine={false} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <ChartTooltip cursor={{ fill: "var(--color-bd-icon-light)" }} content={<ChartTooltipContent hideIndicator />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} animationDuration={900}>
            {data.map((d) => (
              <Cell key={d.severity} fill={SEVERITY_COLOR[d.severity]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Panel>
  );
}

/** Six weeks of discovered vs patched (sample data — swap for your scanner's history). */
const trend = [
  { week: "W1", discovered: 14, patched: 9 },
  { week: "W2", discovered: 11, patched: 12 },
  { week: "W3", discovered: 17, patched: 10 },
  { week: "W4", discovered: 9, patched: 15 },
  { week: "W5", discovered: 12, patched: 13 },
  { week: "W6", discovered: 8, patched: 14 },
];

const trendConfig = {
  discovered: { label: "Discovered", color: "#c42a33" },
  patched: { label: "Patched", color: "#3a9e94" },
} satisfies ChartConfig;

export function RemediationTrend() {
  return (
    <Panel className="h-full px-[16px] pt-[18px] pb-[12px] xl:px-[22px] xl:pt-[22px]">
      <div className="flex justify-end gap-[18px]">
        {Object.values(trendConfig).map((c) => (
          <span key={c.label} className="flex items-center gap-[8px] text-[12px] text-bd-muted xl:text-[13px]">
            <span className="h-[3px] w-[14px] rounded-full" style={{ background: c.color }} />
            {c.label}
          </span>
        ))}
      </div>
      <ChartContainer config={trendConfig} className="mt-[10px] aspect-auto h-[204px] w-full xl:h-[222px]">
        <LineChart data={trend} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-bd-grid)" />
          <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <ChartTooltip cursor={{ stroke: "var(--color-bd-card-border)" }} content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="discovered" stroke="var(--color-discovered)" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0, fill: "var(--color-discovered)" }} animationDuration={1000} />
          <Line type="monotone" dataKey="patched" stroke="var(--color-patched)" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0, fill: "var(--color-patched)" }} animationDuration={1000} animationBegin={150} />
        </LineChart>
      </ChartContainer>
    </Panel>
  );
}
