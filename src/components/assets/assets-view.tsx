"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, MoreHorizontal, Pencil, Plus, Radar, Server, ServerOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Stagger, listContainer, listItem } from "@/components/shared/motion";
import { Panel, Section } from "@/components/shared/section";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog, primaryBtn, wait } from "@/components/shared/dialog-kit";
import {
  EmptyState,
  FilterTabs,
  RiskBar,
  SearchBox,
  StatTile,
  StatusBadge,
  tableCls,
  tableWrap,
  tdCls,
  thCls,
  trCls,
} from "@/components/shared/security";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { timeAgo, useApp, type Asset } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ASSET_ICON, ASSET_TYPES } from "./asset-meta";
import { AssetDialog } from "./asset-dialog";
import { RiskByType } from "./risk-by-type";

const TABS = ["All", ...ASSET_TYPES] as const;
type Tab = (typeof TABS)[number];
const PER_PAGE = 8;

export function AssetsView() {
  const params = useSearchParams();
  const assets = useApp((s) => s.assets);

  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<{ open: boolean; asset: Asset | null; key: number }>(() => ({ open: params.get("new") === "1", asset: null, key: 0 }));
  const [removing, setRemoving] = useState<Asset | null>(null);
  const [scanning, setScanning] = useState<Set<string>>(() => new Set());

  const counts = useMemo(() => {
    const c: Partial<Record<Tab, number>> = { All: assets.length };
    for (const t of ASSET_TYPES) c[t] = assets.filter((a) => a.type === t).length;
    return c;
  }, [assets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets
      .filter((a) => tab === "All" || a.type === tab)
      .filter((a) => !q || [a.name, a.ip, a.owner, a.type, a.environment].some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => b.risk - a.risk);
  }, [assets, tab, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const atRisk = assets.filter((a) => a.status === "At risk").length;
  const offline = assets.filter((a) => a.status === "Offline").length;
  const avgRisk = assets.length ? Math.round(assets.reduce((n, a) => n + a.risk, 0) / assets.length) : 0;
  const attention = useMemo(() => [...assets].filter((a) => a.status !== "Protected").sort((a, b) => b.risk - a.risk).slice(0, 4), [assets]);

  const openAdd = () => setDialog((d) => ({ open: true, asset: null, key: d.key + 1 }));
  const openEdit = (asset: Asset) => setDialog((d) => ({ open: true, asset, key: d.key + 1 }));

  const scan = (asset: Asset) => {
    if (scanning.has(asset.id)) return;
    setScanning((s) => new Set(s).add(asset.id));
    toast.promise(wait(1800), {
      loading: `Scanning ${asset.name}…`,
      success: () => {
        const current = useApp.getState().assets.find((a) => a.id === asset.id);
        if (current) {
          const risk = Math.max(5, current.risk - (3 + Math.floor(Math.random() * 8)));
          const status = current.status === "Offline" ? "Offline" : risk >= 60 ? "At risk" : "Protected";
          useApp.getState().updateAsset(asset.id, { lastScan: new Date().toISOString(), risk, status });
        }
        setScanning((s) => {
          const n = new Set(s);
          n.delete(asset.id);
          return n;
        });
        return `${asset.name} scanned — no new vulnerabilities`;
      },
    });
  };

  const confirmRemove = () => {
    if (!removing) return;
    useApp.getState().removeAsset(removing.id);
    toast.success(`${removing.name} removed from monitoring`);
    setRemoving(null);
  };

  return (
    <Stagger className="flex flex-col gap-[22px] xl:gap-[26px]">
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4 xl:gap-[22px]">
        <StatTile icon={Server} tone="accent" label="Total assets" value={assets.length} hint={`${new Set(assets.map((a) => a.type)).size} asset types`} />
        <StatTile icon={AlertTriangle} tone="red" label="At risk" value={atRisk} hint="Risk score 60 or above" />
        <StatTile icon={Activity} tone={avgRisk >= 60 ? "red" : avgRisk >= 40 ? "yellow" : "green"} label="Average risk score" value={avgRisk} suffix="/100" hint="Lower is better" />
        <StatTile icon={ServerOff} tone="muted" label="Offline" value={offline} hint="Not reporting to the agent" />
      </div>

      <div className="grid gap-[22px] lg:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] xl:gap-[26px]">
        <Section title="Risk by Asset Type">
          <RiskByType assets={assets} />
        </Section>
        <Section title="Needs Attention">
          <Panel className="h-full p-[8px] xl:p-[10px]">
            {attention.length ? (
              <motion.ul variants={listContainer} initial="hidden" animate="show" className="flex flex-col">
                {attention.map((a) => {
                  const Icon = ASSET_ICON[a.type];
                  return (
                    <motion.li key={a.id} variants={listItem} className="flex items-center gap-[12px] rounded-[6px] px-[10px] py-[11px] xl:px-[14px]">
                      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px] bg-bd-tint-red text-bd-red">
                        <Icon className="size-[18px]" strokeWidth={1.7} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-bd-primary xl:text-[14px]">{a.name}</span>
                        <span className="mt-[4px] block">
                          <RiskBar value={a.risk} />
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => scan(a)}
                        disabled={scanning.has(a.id)}
                        aria-label={`Scan ${a.name}`}
                        className="flex size-[34px] shrink-0 items-center justify-center rounded-[8px] border border-bd-card-border text-bd-muted transition-colors hover:border-bd-royal hover:text-bd-royal disabled:opacity-50"
                      >
                        <Radar className={cn("size-[16px]", scanning.has(a.id) && "animate-spin")} />
                      </button>
                    </motion.li>
                  );
                })}
              </motion.ul>
            ) : (
              <EmptyState icon={Server} title="Everything is protected">
                No assets are at risk or offline right now.
              </EmptyState>
            )}
          </Panel>
        </Section>
      </div>

      <Section title="Asset Inventory">
        <div className="mb-[16px] flex flex-col gap-[14px] lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 lg:flex-1">
            <FilterTabs tabs={TABS} value={tab} onChange={(t) => (setTab(t), setPage(1))} layoutId="assets-tab" counts={counts} />
          </div>
          <div className="flex gap-[10px]">
            <SearchBox value={query} onChange={(v) => (setQuery(v), setPage(1))} placeholder="Search name, IP, owner…" className="min-w-0 flex-1 lg:w-[260px] lg:flex-none" />
            <button type="button" onClick={openAdd} className={primaryBtn}>
              <Plus className="size-[16px]" />
              <span className="max-sm:sr-only">Add asset</span>
            </button>
          </div>
        </div>

        <Panel hover={false}>
          {rows.length ? (
            <div className={tableWrap}>
              <table className={tableCls}>
                <thead>
                  <tr>
                    <th className={thCls}>Asset</th>
                    <th className={thCls}>Type</th>
                    <th className={thCls}>Environment</th>
                    <th className={thCls}>Owner</th>
                    <th className={cn(thCls, "w-[160px]")}>Risk</th>
                    <th className={thCls}>Status</th>
                    <th className={thCls}>Last scan</th>
                    <th className={cn(thCls, "w-[56px]")}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <motion.tbody key={`${tab}-${query}-${current}`} variants={listContainer} initial="hidden" animate="show">
                  {rows.map((a) => {
                    const Icon = ASSET_ICON[a.type];
                    return (
                      <motion.tr key={a.id} variants={listItem} className={trCls}>
                        <td className={tdCls}>
                          <span className="block font-medium text-bd-primary">{a.name}</span>
                          <span className="block text-[12px] text-bd-muted">{a.ip}</span>
                        </td>
                        <td className={tdCls}>
                          <span className="flex items-center gap-[8px] whitespace-nowrap">
                            <Icon className="size-[16px] text-bd-muted" strokeWidth={1.7} />
                            {a.type}
                          </span>
                        </td>
                        <td className={cn(tdCls, "whitespace-nowrap text-bd-muted")}>{a.environment}</td>
                        <td className={cn(tdCls, "whitespace-nowrap")}>{a.owner}</td>
                        <td className={tdCls}>
                          <RiskBar value={a.risk} />
                        </td>
                        <td className={tdCls}>
                          <StatusBadge status={a.status} />
                        </td>
                        <td className={cn(tdCls, "whitespace-nowrap text-bd-muted")}>{scanning.has(a.id) ? <span className="text-bd-royal">Scanning…</span> : timeAgo(a.lastScan)}</td>
                        <td className={cn(tdCls, "text-right")}>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label={`Actions for ${a.name}`}
                              className="flex size-[32px] items-center justify-center rounded-[6px] text-bd-muted transition-colors hover:bg-bd-input hover:text-bd-primary data-[state=open]:bg-bd-input"
                            >
                              <MoreHorizontal className="size-[18px]" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[170px] rounded-[8px] border-bd-border p-[6px]">
                              <DropdownMenuItem onSelect={() => scan(a)} disabled={scanning.has(a.id)} className="cursor-pointer rounded-[6px] text-bd-primary focus:bg-bd-input">
                                <Radar className="size-[15px]" /> Scan now
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => openEdit(a)} className="cursor-pointer rounded-[6px] text-bd-primary focus:bg-bd-input">
                                <Pencil className="size-[15px]" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => setRemoving(a)} className="cursor-pointer rounded-[6px] text-bd-red focus:bg-bd-tint-red-soft focus:text-bd-red">
                                <Trash2 className="size-[15px] text-bd-red" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Server} title="No assets found">
              {query || tab !== "All" ? "Try a different search or asset type." : "Add your first asset to start monitoring it."}
            </EmptyState>
          )}
        </Panel>
        <Pagination page={current} pages={pages} onChange={setPage} layoutId="assets-page" className="mt-[16px]" />
      </Section>

      <AssetDialog key={dialog.key} open={dialog.open} asset={dialog.asset} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))} />
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(o) => !o && setRemoving(null)}
        title="Remove asset?"
        description={removing ? `${removing.name} will no longer be monitored or scanned. You can add it again later.` : ""}
        confirmLabel="Remove"
        destructive
        onConfirm={confirmRemove}
      />
    </Stagger>
  );
}
