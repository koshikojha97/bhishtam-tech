"use client";

import { Bug, ShieldCheck, ShieldAlert, TriangleAlert } from "lucide-react";
import { Stagger } from "@/components/shared/motion";
import { Section } from "@/components/shared/section";
import { StatTile } from "@/components/shared/security";
import { useApp } from "@/lib/store";
import { OpenBySeverity, RemediationTrend } from "./vuln-charts";
import { VulnTable } from "./vuln-table";

export function VulnerabilitiesView() {
  const vulns = useApp((s) => s.vulnerabilities);
  const open = vulns.filter((v) => v.status !== "Patched");
  const critical = open.filter((v) => v.severity === "Critical").length;
  const monthAgo = Date.now() - 30 * 86_400_000;
  const patched = vulns.filter((v) => v.status === "Patched" && v.patchedAt && +new Date(v.patchedAt) >= monthAgo).length;
  const high = open.filter((v) => v.severity === "High").length;
  const avgCvss = open.length ? open.reduce((n, v) => n + v.cvss, 0) / open.length : 0;

  return (
    <Stagger className="flex flex-col gap-[22px] xl:gap-[26px]">
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4 xl:gap-[22px]">
        <StatTile icon={Bug} tone="accent" label="Open vulnerabilities" value={open.length} hint={`Avg. CVSS ${avgCvss.toFixed(1)} · ${vulns.length} tracked`} />
        <StatTile icon={TriangleAlert} tone="red" label="Critical open" value={critical} hint="Patch within 48 hours" />
        <StatTile icon={ShieldCheck} tone="green" label="Patched this month" value={patched} hint="Last 30 days" />
        <StatTile icon={ShieldAlert} tone="orange" label="High severity open" value={high} hint="Patch within 7 days" />
      </div>

      <div className="grid gap-[22px] lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] xl:gap-[26px]">
        <Section title="Open by Severity">
          <OpenBySeverity />
        </Section>
        <Section title="Remediation Trend">
          <RemediationTrend />
        </Section>
      </div>

      <Section title="All Vulnerabilities">
        <VulnTable />
      </Section>
    </Stagger>
  );
}
