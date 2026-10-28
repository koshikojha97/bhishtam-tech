"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, CheckCircle2, Plus, ShieldCheck, Siren, UserRound } from "lucide-react";
import { Stagger } from "@/components/shared/motion";
import { Panel, Section } from "@/components/shared/section";
import { primaryBtn } from "@/components/shared/dialog-kit";
import { EmptyState, FilterTabs, SearchBox, SeverityBadge, StatTile, StatusBadge } from "@/components/shared/security";
import { timeAgo, useApp, type IncidentStatus, type Severity } from "@/lib/store";
import { cn } from "@/lib/utils";
import { IncidentDetail, PLAYBOOK, stepsDone } from "./incident-detail";
import { ReportIncidentDialog } from "./report-incident-dialog";

const TABS = ["All", "Open", "Contained", "Resolved"] as const;
type Tab = (typeof TABS)[number];
const SEVERITY_RANK: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
const STATUS_RANK: Record<IncidentStatus, number> = { Open: 0, Contained: 1, Resolved: 2 };

export function IncidentsView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const incidents = useApp((s) => s.incidents);
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [reporting, setReporting] = useState(params.get("new") === "1");
  const [openId, setOpenId] = useState<string | null>(null);

  // active first, then by severity, then most recently updated
  const sorted = useMemo(
    () =>
      [...incidents].sort(
        (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || +new Date(b.updated) - +new Date(a.updated),
      ),
    [incidents],
  );
  const counts = useMemo(() => {
    const c: Record<Tab, number> = { All: incidents.length, Open: 0, Contained: 0, Resolved: 0 };
    for (const i of incidents) c[i.status]++;
    return c;
  }, [incidents]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((i) => (tab === "All" || i.status === tab) && (!q || [i.ref, i.title, i.owner, i.summary].some((v) => v.toLowerCase().includes(q))));
  }, [sorted, tab, query]);

  const active = incidents.filter((i) => i.status !== "Resolved");
  const avgProgress = active.length ? Math.round(active.reduce((n, i) => n + i.progress, 0) / active.length) : 100;
  const selected = incidents.find((i) => i.id === openId) ?? null;

  const setReportOpen = (o: boolean) => {
    setReporting(o);
    // drop ?new=1 so a refresh doesn't reopen the form
    if (!o && params.get("new")) router.replace(pathname, { scroll: false });
  };

  return (
    <Stagger className="flex flex-col gap-[22px] xl:gap-[26px]">
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4 xl:gap-[22px]">
        <StatTile icon={Siren} tone="red" label="Open incidents" value={counts.Open} hint="Response in progress" />
        <StatTile icon={ShieldCheck} tone="yellow" label="Contained" value={counts.Contained} hint="Threat isolated" />
        <StatTile icon={CheckCircle2} tone="green" label="Resolved" value={counts.Resolved} hint={`of ${incidents.length} total`} />
        <StatTile icon={Activity} tone="accent" label="Avg. playbook progress" value={avgProgress} suffix="%" hint="Across active incidents" />
      </div>

      <Section title="Incident Queue">
        <Panel hover={false} className="flex flex-col gap-[14px] p-[16px] xl:p-[20px]">
          <FilterTabs tabs={TABS} value={tab} onChange={setTab} layoutId="incidents-tab" counts={counts} />
          <div className="flex flex-wrap items-center gap-[10px]">
            <SearchBox value={query} onChange={setQuery} placeholder="Search ref, title, owner…" className="min-w-[200px] flex-1" />
            <button type="button" onClick={() => setReportOpen(true)} className={primaryBtn}>
              <Plus className="size-[16px]" /> Report incident
            </button>
          </div>

          {filtered.length ? (
            <motion.ul layout className="grid grid-cols-1 gap-[12px] lg:grid-cols-2 xl:gap-[14px]">
              <AnimatePresence initial={false}>
                {filtered.map((i) => {
                  const done = stepsDone(i.progress);
                  return (
                    <motion.li key={i.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}>
                      <button
                        type="button"
                        onClick={() => setOpenId(i.id)}
                        className="flex h-full w-full flex-col gap-[12px] rounded-[8px] border border-bd-border bg-bd-page p-[16px] text-left transition-colors hover:border-bd-card-border hover:bg-bd-icon-light focus-visible:border-bd-royal focus-visible:outline-none xl:p-[18px]"
                      >
                        <span className="flex items-center justify-between gap-[10px] text-[12px] text-bd-muted">
                          <span>{i.ref}</span>
                          <span>Updated {timeAgo(i.updated)}</span>
                        </span>
                        <span className="text-[14px] font-medium text-bd-primary xl:text-[15px]">{i.title}</span>
                        <span className="flex flex-wrap items-center gap-[8px]">
                          <SeverityBadge severity={i.severity} />
                          <StatusBadge status={i.status} />
                        </span>
                        <span className="flex flex-wrap items-center gap-x-[16px] gap-y-[4px] text-[12px] text-bd-muted xl:text-[13px]">
                          <span className="flex items-center gap-[6px]">
                            <UserRound className="size-[14px]" strokeWidth={1.7} /> {i.owner}
                          </span>
                          <span>
                            {i.affectedAssets} affected {i.affectedAssets === 1 ? "asset" : "assets"}
                          </span>
                        </span>
                        <span className="mt-auto flex flex-col gap-[6px]">
                          <span className="flex items-center justify-between text-[12px]">
                            <span className="text-bd-muted">{done < PLAYBOOK.length ? `Next: ${PLAYBOOK[done]}` : "Playbook complete"}</span>
                            <span className="text-bd-primary tabular-nums">{i.progress}%</span>
                          </span>
                          <span className="h-[5px] overflow-hidden rounded-full bg-bd-input">
                            <motion.span
                              className={cn("block h-full rounded-full", i.progress === 100 ? "bg-bd-green" : "bg-bd-royal")}
                              initial={{ width: 0 }}
                              animate={{ width: `${i.progress}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <EmptyState icon={Siren} title="No incidents match">
              {incidents.length ? "Try another status or search term." : "Nothing to respond to right now."}
            </EmptyState>
          )}
        </Panel>
      </Section>

      <ReportIncidentDialog open={reporting} onOpenChange={setReportOpen} onCreated={(i) => (setTab("All"), setQuery(""), setOpenId(i.id))} />
      <IncidentDetail incident={selected} onOpenChange={(o) => !o && setOpenId(null)} />
    </Stagger>
  );
}
