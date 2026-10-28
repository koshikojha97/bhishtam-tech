"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Panel } from "@/components/shared/section";

/** Monthly posture score (sample data). */
const data = [
  { month: "May", score: 58 },
  { month: "Jun", score: 61 },
  { month: "Jul", score: 59 },
  { month: "Aug", score: 66 },
  { month: "Sep", score: 70 },
  { month: "Oct", score: 74 },
];

const config = { score: { label: "Security score", color: "#c42a33" } } satisfies ChartConfig;

export function ScoreTrend() {
  return (
    <Panel className="h-full px-[16px] pt-[20px] pb-[10px] xl:px-[22px] xl:pt-[24px]">
      <ChartContainer config={config} className="aspect-auto h-[220px] w-full xl:h-[240px]">
        <AreaChart data={data} margin={{ left: -18, right: 6, top: 6, bottom: 0 }}>
          <defs>
            <linearGradient id="score-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c42a33" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#c42a33" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-bd-grid)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <YAxis domain={[40, 100]} ticks={[40, 60, 80, 100]} tickLine={false} axisLine={false} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <ChartTooltip cursor={{ stroke: "var(--color-bd-card-border)" }} content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey="score" stroke="#c42a33" strokeWidth={2.5} fill="url(#score-fill)" dot={{ r: 3, fill: "#c42a33", strokeWidth: 0 }} activeDot={{ r: 5 }} animationDuration={1000} />
        </AreaChart>
      </ChartContainer>
    </Panel>
  );
}
