"use client";

import { Bug, Laptop, ShieldAlert, Siren } from "lucide-react";
import { Stagger } from "@/components/shared/motion";
import { Section } from "@/components/shared/section";
import { StatTile } from "@/components/shared/security";
import { SecurityScore } from "@/components/overview/security-score";
import { ThreatActivity } from "@/components/overview/threat-activity";
import { RecentAlerts } from "@/components/overview/recent-alerts";
import { AttackTypes } from "@/components/overview/attack-types";
import { QuickScan } from "@/components/overview/quick-scan";
import { ScoreTrend } from "@/components/overview/score-trend";
import { TopOrigins } from "@/components/overview/top-origins";
import { useApp } from "@/lib/store";

export default function OverviewPage() {
  const alerts = useApp((s) => s.alerts);
  const incidents = useApp((s) => s.incidents);
  const vulnerabilities = useApp((s) => s.vulnerabilities);
  const devices = useApp((s) => s.devices);

  const openAlerts = alerts.filter((a) => a.status !== "Resolved");
  const criticalVulns = vulnerabilities.filter((v) => v.severity === "Critical" && v.status !== "Patched").length;
  const activeIncidents = incidents.filter((i) => i.status !== "Resolved").length;
  const healthy = devices.filter((d) => d.status === "Healthy").length;

  return (
    <Stagger className="flex flex-col gap-[22px] xl:gap-[26px]">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4 xl:gap-[22px]">
        <StatTile icon={ShieldAlert} tone="red" label="Active threats" value={openAlerts.length} hint={`${openAlerts.filter((a) => a.severity === "Critical").length} critical`} href="/dashboard/threats" />
        <StatTile icon={Siren} tone="accent" label="Open incidents" value={activeIncidents} hint={`${incidents.length} this month`} href="/dashboard/incidents" />
        <StatTile icon={Bug} tone="yellow" label="Critical vulnerabilities" value={criticalVulns} hint={`${vulnerabilities.filter((v) => v.status !== "Patched").length} unpatched in total`} href="/dashboard/vulnerabilities" />
        <StatTile icon={Laptop} tone="green" label="Protected devices" value={healthy} suffix={`/${devices.length}`} hint="Agent reporting" href="/dashboard/devices" />
      </div>

      {/* Score + activity */}
      <div className="grid gap-[22px] lg:grid-cols-[minmax(0,32fr)_minmax(0,68fr)] xl:gap-[26px]">
        <Section title="Security Score">
          <SecurityScore />
        </Section>
        <Section title="Threat Activity">
          <ThreatActivity />
        </Section>
      </div>

      {/* Alerts + attack types */}
      <div className="grid gap-[22px] lg:grid-cols-[minmax(0,68fr)_minmax(0,32fr)] xl:gap-[26px]">
        <Section title="Recent Alerts" action="View all" actionHref="/dashboard/threats">
          <RecentAlerts />
        </Section>
        <Section title="Attack Types">
          <AttackTypes />
        </Section>
      </div>

      {/* Scan + trend + origins */}
      <div className="grid gap-[22px] lg:grid-cols-2 xl:grid-cols-[minmax(0,30fr)_minmax(0,42fr)_minmax(0,28fr)] xl:gap-[26px]">
        <Section id="quick-scan" title="Quick Scan">
          <QuickScan />
        </Section>
        <Section title="Score Trend">
          <ScoreTrend />
        </Section>
        <Section title="Top Attack Origins" className="lg:col-span-2 xl:col-span-1">
          <TopOrigins />
        </Section>
      </div>
    </Stagger>
  );
}
