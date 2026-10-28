"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Panel } from "@/components/shared/section";
import { useBreakpoint } from "@/hooks/use-breakpoint";

/** Last 7 days of sensor telemetry (sample data — swap for your SIEM query). */
const data = [
  { day: "Mon", blocked: 412, detected: 38 },
  { day: "Tue", blocked: 386, detected: 29 },
  { day: "Wed", blocked: 455, detected: 51 },
  { day: "Thu", blocked: 398, detected: 33 },
  { day: "Fri", blocked: 521, detected: 64 },
  { day: "Sat", blocked: 287, detected: 18 },
  { day: "Sun", blocked: 342, detected: 27 },
];

const config = {
  blocked: { label: "Blocked", color: "#c42a33" },
  detected: { label: "Needs review", color: "#3a9e94" },
} satisfies ChartConfig;

const total = data.reduce((n, d) => n + d.blocked, 0);

export function ThreatActivity() {
  const bp = useBreakpoint();
  const bar = bp === "xl" ? 14 : bp === "lg" ? 10 : 7;
  return (
    <Panel className="h-full px-[18px] pt-[20px] pb-[12px] xl:px-[26px] xl:pt-[24px] xl:pb-[18px]">
      <div className="flex flex-wrap items-end justify-between gap-[12px]">
        <div>
          <p className="text-[13px] text-bd-muted">Threats blocked this week</p>
          <p className="text-[26px] leading-tight font-medium text-bd-primary xl:text-[30px]">{total.toLocaleString("en-US")}</p>
        </div>
        <div className="flex gap-[18px]">
          {Object.values(config).map((c) => (
            <span key={c.label} className="flex items-center gap-[8px] text-[12px] text-bd-muted xl:text-[13px]">
              <span className="size-[10px] rounded-[3px]" style={{ background: c.color }} />
              {c.label}
            </span>
          ))}
        </div>
      </div>
      <ChartContainer config={config} className="mt-[14px] aspect-auto h-[210px] w-full xl:h-[240px]">
        <BarChart data={data} barGap={4} barCategoryGap={bp === "sm" ? "18%" : "30%"} margin={{ left: -14, right: 0, top: 6, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-bd-grid)" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tickMargin={6} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <ChartTooltip cursor={{ fill: "var(--color-bd-icon-light)", radius: 6 }} content={<ChartTooltipContent />} />
          <Bar dataKey="blocked" fill="var(--color-blocked)" radius={[4, 4, 0, 0]} barSize={bar} animationDuration={900} />
          <Bar dataKey="detected" fill="var(--color-detected)" radius={[4, 4, 0, 0]} barSize={bar} animationDuration={900} animationBegin={150} />
        </BarChart>
      </ChartContainer>
    </Panel>
  );
}
