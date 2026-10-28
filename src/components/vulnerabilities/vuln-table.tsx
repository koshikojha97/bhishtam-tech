"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ExternalLink, ShieldCheck } from "lucide-react";
import { Panel } from "@/components/shared/section";
import { Pagination } from "@/components/shared/pagination";
import { SelectField } from "@/components/shared/form-controls";
import { listContainer, listItem } from "@/components/shared/motion";
import { EmptyState, FilterTabs, SearchBox, SeverityBadge, StatusBadge, tableCls, tableWrap, tdCls, thCls, trCls } from "@/components/shared/security";
import { SEVERITIES, timeAgo, useApp, type Severity, type Vulnerability } from "@/lib/store";
import { cn } from "@/lib/utils";
import { VulnDialog, CvssChip } from "./vuln-dialog";

const TABS = ["All", "Open", "In progress", "Patched"] as const;
type Tab = (typeof TABS)[number];
const PER_PAGE = 8;
const SEV_ORDER: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export const nvdUrl = (cve: string) => `https://nvd.nist.gov/vuln/detail/${cve}`;

export function VulnTable() {
  const vulns = useApp((s) => s.vulnerabilities);
  const [tab, setTab] = useState<Tab>("All");
  const [severity, setSeverity] = useState<"all" | Severity>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({ All: vulns.length, Open: vulns.filter((v) => v.status === "Open").length, "In progress": vulns.filter((v) => v.status === "In progress").length, Patched: vulns.filter((v) => v.status === "Patched").length }),
    [vulns],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vulns
      .filter((v) => tab === "All" || v.status === tab)
      .filter((v) => severity === "all" || v.severity === severity)
      .filter((v) => !q || `${v.cve} ${v.title} ${v.asset}`.toLowerCase().includes(q))
      .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || b.cvss - a.cvss);
  }, [vulns, tab, severity, query]);

  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const reset = () => setPage(1);
  const selected = vulns.find((v) => v.id === openId) ?? null;

  return (
    <div className="flex flex-col gap-[16px]">
      <FilterTabs tabs={TABS} value={tab} onChange={(t) => (setTab(t), reset())} layoutId="vuln-tab" counts={counts} />
      <div className="flex flex-col gap-[12px] sm:flex-row">
        <SearchBox value={query} onChange={(v) => (setQuery(v), reset())} placeholder="Search CVE, title or asset…" className="sm:flex-1" />
        <SelectField
          value={severity}
          onValueChange={(v) => (setSeverity(v as "all" | Severity), reset())}
          options={[{ value: "all", label: "All severities" }, ...SEVERITIES.map((s) => ({ value: s, label: s }))]}
          className="sm:w-[190px] xl:data-[size=default]:h-[40px]"
        />
      </div>

      <Panel hover={false} className="overflow-hidden">
        {visible.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="No vulnerabilities match">
            Try a different status, severity or search term.
          </EmptyState>
        ) : (
          <div className={tableWrap}>
            <table className={cn(tableCls, "min-w-[940px]")}>
              <thead>
                <tr>
                  <th className={thCls}>CVE</th>
                  <th className={thCls}>Vulnerability</th>
                  <th className={thCls}>Severity</th>
                  <th className={thCls}>CVSS</th>
                  <th className={thCls}>Asset</th>
                  <th className={thCls}>Fix</th>
                  <th className={thCls}>Status</th>
                  <th className={thCls}>Found</th>
                </tr>
              </thead>
              <motion.tbody key={`${tab}-${severity}-${current}`} variants={listContainer} initial="hidden" animate="show">
                {visible.map((v) => (
                  <Row key={v.id} v={v} onOpen={() => setOpenId(v.id)} />
                ))}
              </motion.tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="flex flex-col items-center justify-between gap-[12px] sm:flex-row">
        <p className="text-[12px] text-bd-muted xl:text-[13px]">
          Showing {visible.length} of {rows.length}
        </p>
        <Pagination page={current} pages={pages} onChange={setPage} layoutId="vuln-page" />
      </div>

      <VulnDialog vuln={selected} onOpenChange={(o) => !o && setOpenId(null)} />
    </div>
  );
}

function Row({ v, onOpen }: { v: Vulnerability; onOpen: () => void }) {
  return (
    <motion.tr
      variants={listItem}
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen())}
      className={cn(trCls, "cursor-pointer outline-none focus-visible:bg-bd-icon-light")}
    >
      <td className={tdCls}>
        <a
          href={nvdUrl(v.cve)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-[5px] font-medium whitespace-nowrap text-bd-royal hover:underline"
        >
          {v.cve}
          <ExternalLink className="size-[12px]" />
        </a>
      </td>
      <td className={cn(tdCls, "max-w-[280px]")}>
        <span className="line-clamp-2 text-bd-primary">{v.title}</span>
      </td>
      <td className={tdCls}>
        <SeverityBadge severity={v.severity} />
      </td>
      <td className={tdCls}>
        <CvssChip score={v.cvss} />
      </td>
      <td className={cn(tdCls, "whitespace-nowrap text-bd-muted")}>{v.asset}</td>
      <td className={tdCls}>
        {v.fixAvailable ? (
          <span className="inline-flex items-center gap-[4px] text-bd-green">
            <Check className="size-[14px]" /> Yes
          </span>
        ) : (
          <span className="text-bd-muted">No</span>
        )}
      </td>
      <td className={tdCls}>
        <StatusBadge status={v.status} />
      </td>
      <td className={cn(tdCls, "whitespace-nowrap text-bd-muted")}>{timeAgo(v.discovered)}</td>
    </motion.tr>
  );
}
