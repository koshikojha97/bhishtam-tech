"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Panel } from "@/components/shared/section";
import type { Device } from "@/lib/store";
import { osFamily } from "./device-meta";

const COLORS: Record<string, string> = {
  Windows: "#c42a33",
  macOS: "#3a9e94",
  Linux: "#c9a03c",
  iOS: "#b8657f",
  Android: "#3d9e7c",
  "Windows Server": "#8d8d8d",
};

const config = Object.fromEntries(Object.entries(COLORS).map(([k, color]) => [k, { label: k, color }])) satisfies ChartConfig;

/** Donut of enrolled devices by OS family. */
export function OsDistribution({ devices }: { devices: Device[] }) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of devices) counts.set(osFamily(d.os), (counts.get(osFamily(d.os)) ?? 0) + 1);
    return [...counts].map(([family, value]) => ({ family, value })).sort((a, b) => b.value - a.value);
  }, [devices]);

  return (
    <Panel className="flex h-full flex-col gap-[16px] p-[18px] xl:p-[24px]">
      <div className="relative mx-auto aspect-square w-full max-w-[190px]">
        <ChartContainer config={config} className="aspect-square w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="family" hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="family" innerRadius="68%" outerRadius="100%" paddingAngle={3} stroke="none" animationDuration={900}>
              {data.map((d) => (
                <Cell key={d.family} fill={COLORS[d.family] ?? "#8d8d8d"} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] leading-none font-medium text-bd-primary">{devices.length}</span>
          <span className="mt-[4px] text-[12px] text-bd-muted">devices</span>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-x-[14px] gap-y-[8px]">
        {data.map((d) => (
          <li key={d.family} className="flex min-w-0 items-center gap-[8px] text-[12px] xl:text-[13px]">
            <span className="size-[9px] shrink-0 rounded-[2px]" style={{ background: COLORS[d.family] ?? "#8d8d8d" }} />
            <span className="truncate text-bd-muted">{d.family}</span>
            <span className="ml-auto text-bd-primary tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
