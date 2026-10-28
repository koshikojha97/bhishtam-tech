"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, Search, ShieldAlert, ShieldX } from "lucide-react";
import { Stagger } from "@/components/shared/motion";
import { Panel, Section } from "@/components/shared/section";
import { Pagination } from "@/components/shared/pagination";
import { SelectField } from "@/components/shared/form-controls";
import { outlineBtn } from "@/components/shared/dialog-kit";
import {
  EmptyState,
  FilterTabs,
  SearchBox,
  SeverityBadge,
  StatTile,
  StatusBadge,
  tableCls,
  tableWrap,
  tdCls,
  thCls,
  trCls,
} from "@/components/shared/security";
import { downloadFile, toCsv } from "@/lib/download";
import { SEVERITIES, fmtDate, timeAgo, useApp, type AlertStatus, type Severity } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AlertDetail } from "./alert-detail";

const TABS = ["All", "Open", "Investigating", "Resolved"] as const;
type Tab = (typeof TABS)[number];
const PER_PAGE = 8;

export function ThreatsView() {
  const params = useSearchParams();
  const alerts = useApp((s) => s.alerts);
  const [tab, setTab] = useState<Tab>("All");
  const [severity, setSeverity] = useState<"All" | Severity>("All");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = useMemo(() => [...alerts].sort((a, b) => +new Date(b.date) - +new Date(a.date)), [alerts]);
  const counts = useMemo(() => {
    const c: Record<Tab, number> = { All: alerts.length, Open: 0, Investigating: 0, Resolved: 0 };
    for (const a of alerts) c[a.status]++;
    return c;
  }, [alerts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter(
      (a) =>
        (tab === "All" || a.status === (tab as AlertStatus)) &&
        (severity === "All" || a.severity === severity) &&
        (!q || [a.ref, a.title, a.category, a.source, a.asset, a.ip, a.country].some((v) => v.toLowerCase().includes(q))),
    );
  }, [sorted, tab, severity, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const open = alerts.find((a) => a.id === openId) ?? null;

  const criticalOpen = alerts.filter((a) => a.severity === "Critical" && a.status !== "Resolved").length;
  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const exportCsv = () => {
    downloadFile(
      `alerts-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(
        filtered.map((a) => ({
          Ref: a.ref,
          Title: a.title,
          Category: a.category,
          Severity: a.severity,
          Status: a.status,
          Source: a.source,
          Asset: a.asset,
          IP: a.ip,
          Country: a.country,
          Detected: fmtDate(a.date),
        })),
      ),
      "text/csv;charset=utf-8",
    );
  };

  return (
    <Stagger className="flex flex-col gap-[22px] xl:gap-[26px]">
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4 xl:gap-[22px]">
        <StatTile icon={ShieldAlert} tone="red" label="Open alerts" value={counts.Open} hint="Awaiting triage" />
        <StatTile icon={ShieldX} tone="orange" label="Critical & unresolved" value={criticalOpen} hint="Highest priority" />
        <StatTile icon={Search} tone="yellow" label="Investigating" value={counts.Investigating} hint="Analyst assigned" />
        <StatTile icon={CheckCircle2} tone="green" label="Resolved" value={counts.Resolved} hint={`of ${alerts.length} total`} />
      </div>

      <Section title="Alert Log">
        <Panel hover={false} className="flex min-w-0 flex-col">
          <div className="flex flex-col gap-[14px] px-[16px] pt-[16px] xl:px-[20px] xl:pt-[20px]">
            <FilterTabs tabs={TABS} value={tab} onChange={reset(setTab)} layoutId="threats-tab" counts={counts} />
            <div className="flex flex-wrap items-center gap-[10px]">
              <SearchBox value={query} onChange={reset(setQuery)} placeholder="Search ref, asset, IP…" className="min-w-[200px] flex-1" />
              <SelectField
                value={severity}
                onValueChange={(v) => reset(setSeverity)(v as "All" | Severity)}
                options={[{ value: "All", label: "All severities" }, ...SEVERITIES.map((s) => ({ value: s, label: s }))]}
                className="w-[170px] xl:data-[size=default]:h-[40px]"
              />
              <button type="button" onClick={exportCsv} disabled={!filtered.length} className={outlineBtn}>
                <Download className="size-[16px]" /> Export CSV
              </button>
            </div>
          </div>

          {rows.length ? (
            <div className={cn(tableWrap, "mt-[14px]")}>
              <table className={tableCls}>
                <thead>
                  <tr>
                    {["Ref", "Alert", "Severity", "Source", "Asset", "Origin", "Detected", "Status"].map((h) => (
                      <th key={h} className={thCls}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr
                      key={a.id}
                      tabIndex={0}
                      onClick={() => setOpenId(a.id)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpenId(a.id))}
                      className={cn(trCls, "cursor-pointer outline-none focus-visible:bg-bd-icon-light")}
                    >
                      <td className={cn(tdCls, "whitespace-nowrap text-bd-muted")}>{a.ref}</td>
                      <td className={cn(tdCls, "min-w-[220px]")}>
                        <span className="block font-medium text-bd-primary">{a.title}</span>
                        <span className="block text-[12px] text-bd-muted">{a.category}</span>
                      </td>
                      <td className={tdCls}>
                        <SeverityBadge severity={a.severity} />
                      </td>
                      <td className={cn(tdCls, "whitespace-nowrap")}>{a.source}</td>
                      <td className={cn(tdCls, "whitespace-nowrap")}>{a.asset}</td>
                      <td className={cn(tdCls, "whitespace-nowrap")}>
                        <span className="block">{a.ip}</span>
                        <span className="block text-[12px] text-bd-muted">{a.country}</span>
                      </td>
                      <td className={cn(tdCls, "whitespace-nowrap text-bd-muted")} title={fmtDate(a.date)}>
                        {timeAgo(a.date)}
                      </td>
                      <td className={tdCls}>
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={ShieldAlert} title="No alerts match">
              Try another status, severity or search term.
            </EmptyState>
          )}

          <div className="flex flex-wrap items-center justify-between gap-[12px] border-t border-bd-border px-[16px] py-[12px] xl:px-[20px]">
            <span className="text-[12px] text-bd-muted xl:text-[13px]">
              {filtered.length ? `${(current - 1) * PER_PAGE + 1}–${Math.min(current * PER_PAGE, filtered.length)} of ${filtered.length}` : "0 results"}
            </span>
            <Pagination page={current} pages={pages} onChange={setPage} layoutId="threats-page" />
          </div>
        </Panel>
      </Section>

      <AlertDetail alert={open} onOpenChange={(o) => !o && setOpenId(null)} />
    </Stagger>
  );
}
