"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Panel } from "@/components/shared/section";
import { ScoreRing, scoreTone, toneText } from "@/components/shared/security";
import { CountUp } from "@/components/shared/motion";
import { scoreLabel, securityScore, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Posture gauge + what's pulling the score down. Recomputes live as alerts/vulns/incidents change. */
export function SecurityScore() {
  const alerts = useApp((s) => s.alerts);
  const vulnerabilities = useApp((s) => s.vulnerabilities);
  const incidents = useApp((s) => s.incidents);
  const devices = useApp((s) => s.devices);
  const score = useMemo(() => securityScore({ alerts, vulnerabilities, incidents, devices }), [alerts, vulnerabilities, incidents, devices]);

  const factors = [
    { label: "Unresolved alerts", value: alerts.filter((a) => a.status !== "Resolved").length, href: "/dashboard/threats" },
    { label: "Unpatched vulnerabilities", value: vulnerabilities.filter((v) => v.status !== "Patched").length, href: "/dashboard/vulnerabilities" },
    { label: "Active incidents", value: incidents.filter((i) => i.status !== "Resolved").length, href: "/dashboard/incidents" },
    { label: "Devices at risk", value: devices.filter((d) => d.status === "At risk").length, href: "/dashboard/devices" },
  ];

  return (
    <Panel className="flex h-full flex-col items-center gap-[20px] p-[20px] sm:flex-row lg:flex-col xl:p-[26px]">
      <ScoreRing value={score} size={168}>
        <span className="text-[40px] leading-none font-medium text-bd-primary">
          <CountUp value={score} />
        </span>
        <span className="mt-[4px] text-[12px] text-bd-muted">out of 100</span>
        <span className={cn("mt-[6px] text-[13px] font-medium", toneText(scoreTone(score)))}>{scoreLabel(score)}</span>
      </ScoreRing>
      <div className="flex w-full flex-1 flex-col gap-[10px]">
        <p className="flex items-center gap-[6px] text-[12px] text-bd-green xl:text-[13px]">
          <TrendingUp className="size-[14px]" /> +4 points vs last week
        </p>
        <ul className="flex flex-col divide-y divide-bd-border rounded-[8px] border border-bd-border">
          {factors.map((f) => (
            <li key={f.label}>
              <Link href={f.href} className="flex items-center justify-between gap-[10px] px-[12px] py-[9px] text-[13px] transition-colors hover:bg-bd-icon-light">
                <span className="text-bd-muted">{f.label}</span>
                <span className={cn("font-medium tabular-nums", f.value ? "text-bd-primary" : "text-bd-green")}>{f.value}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
