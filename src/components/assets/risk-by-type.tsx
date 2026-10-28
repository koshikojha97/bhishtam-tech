"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Panel } from "@/components/shared/section";
import type { Asset } from "@/lib/store";
import { ASSET_TYPES } from "./asset-meta";

const config = { risk: { label: "Avg. risk", color: "#c42a33" } } satisfies ChartConfig;
const barColor = (v: number) => (v >= 70 ? "#d14b4b" : v >= 40 ? "#c9a03c" : "#3d9e7c");

/** Average risk score per asset type (types with no assets are skipped). */
export function RiskByType({ assets }: { assets: Asset[] }) {
  const data = useMemo(
    () =>
      ASSET_TYPES.map((type) => {
        const list = assets.filter((a) => a.type === type);
        return { type, risk: list.length ? Math.round(list.reduce((n, a) => n + a.risk, 0) / list.length) : 0, count: list.length };
      }).filter((d) => d.count > 0),
    [assets],
  );

  return (
    <Panel className="h-full px-[16px] pt-[20px] pb-[10px] xl:px-[22px] xl:pt-[24px]">
      <ChartContainer config={config} className="aspect-auto h-[220px] w-full xl:h-[240px]">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 12, top: 0, bottom: 0 }} barCategoryGap="28%">
          <CartesianGrid horizontal={false} stroke="var(--color-bd-grid)" />
          <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <YAxis type="category" dataKey="type" width={86} tickLine={false} axisLine={false} tick={{ fill: "var(--color-bd-muted)", fontSize: 12 }} />
          <ChartTooltip cursor={{ fill: "var(--color-bd-icon-light)" }} content={<ChartTooltipContent />} />
          <Bar dataKey="risk" radius={[0, 4, 4, 0]} animationDuration={900}>
            {data.map((d) => (
              <Cell key={d.type} fill={barColor(d.risk)} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Panel>
  );
}
