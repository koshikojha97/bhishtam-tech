"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Laptop, Lock, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Stagger, listContainer } from "@/components/shared/motion";
import { Panel, Section } from "@/components/shared/section";
import { ConfirmDialog, primaryBtn, wait } from "@/components/shared/dialog-kit";
import { EmptyState, FilterTabs, SearchBox, StatTile } from "@/components/shared/security";
import { useApp, type Device, type DeviceStatus } from "@/lib/store";
import { DeviceCard } from "./device-card";
import { EnrollDialog } from "./enroll-dialog";
import { OsDistribution } from "./os-distribution";

const TABS = ["All", "Healthy", "At risk", "Isolated"] as const satisfies readonly ("All" | DeviceStatus)[];
type Tab = (typeof TABS)[number];

/** Newest agent build per platform — anything older counts as outdated. */
const LATEST_AGENT = (d: Device) => (d.kind === "Mobile" ? "2.9.0" : "4.2.1");

type Confirm = { kind: "isolate" | "remove"; device: Device } | null;

export function DevicesView() {
  const params = useSearchParams();
  const devices = useApp((s) => s.devices);

  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const [enroll, setEnroll] = useState(() => ({ open: params.get("new") === "1", key: 0 }));
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [scanning, setScanning] = useState<Set<string>>(() => new Set());

  const counts = useMemo(() => {
    const c: Partial<Record<Tab, number>> = { All: devices.length };
    for (const t of TABS.slice(1)) c[t] = devices.filter((d) => d.status === t).length;
    return c;
  }, [devices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devices
      .filter((d) => tab === "All" || d.status === tab)
      .filter((d) => !q || [d.name, d.user, d.os, d.kind].some((v) => v.toLowerCase().includes(q)));
  }, [devices, tab, query]);

  const healthy = devices.filter((d) => d.status === "Healthy").length;
  const atRisk = devices.filter((d) => d.status === "At risk").length;
  const pct = (n: number) => (devices.length ? Math.round((n / devices.length) * 100) : 0);
  const encryption = pct(devices.filter((d) => d.encrypted).length);
  const coverage = [
    { label: "Disk encryption", value: encryption },
    { label: "Agent up to date", value: pct(devices.filter((d) => d.agentVersion === LATEST_AGENT(d)).length) },
    { label: "Reported in the last hour", value: pct(devices.filter((d) => Date.now() - +new Date(d.lastSeen) < 3_600_000).length) },
    { label: "No threats in 30 days", value: pct(devices.filter((d) => d.threats === 0).length) },
  ];

  const release = (d: Device) => {
    useApp.getState().updateDevice(d.id, { status: "Healthy", lastSeen: new Date().toISOString() });
    toast.success(`${d.name} released from isolation`);
  };

  const scan = (d: Device) => {
    if (scanning.has(d.id)) return;
    setScanning((s) => new Set(s).add(d.id));
    toast.promise(wait(1800), {
      loading: `Scanning ${d.name}…`,
      success: () => {
        const cur = useApp.getState().devices.find((x) => x.id === d.id);
        if (cur) useApp.getState().updateDevice(d.id, { lastSeen: new Date().toISOString(), ...(cur.status === "At risk" && cur.threats <= 1 ? { status: "Healthy" as const } : {}) });
        setScanning((s) => {
          const n = new Set(s);
          n.delete(d.id);
          return n;
        });
        return `${d.name} scanned — no active threats found`;
      },
    });
  };

  const onConfirm = () => {
    if (!confirm) return;
    const { device: d } = confirm;
    const { updateDevice, removeDevice, notify } = useApp.getState();
    if (confirm.kind === "isolate") {
      updateDevice(d.id, { status: "Isolated" });
      notify({ title: "Device isolated", body: `${d.name} (${d.user}) was cut off from the network`, kind: "device", href: "/dashboard/devices" });
      toast.success(`${d.name} isolated from the network`);
    } else {
      removeDevice(d.id);
      toast.success(`${d.name} removed`);
    }
    setConfirm(null);
  };

  return (
    <Stagger className="flex flex-col gap-[22px] xl:gap-[26px]">
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4 xl:gap-[22px]">
        <StatTile icon={Laptop} tone="accent" label="Total devices" value={devices.length} hint={`${devices.filter((d) => d.status === "Isolated").length} isolated`} />
        <StatTile icon={ShieldCheck} tone="green" label="Healthy" value={healthy} hint="Agent reporting, no threats" />
        <StatTile icon={AlertTriangle} tone="red" label="At risk" value={atRisk} hint="Need attention" />
        <StatTile icon={Lock} tone={encryption >= 90 ? "green" : "yellow"} label="Encryption coverage" value={encryption} suffix="%" hint="Disk encryption enabled" />
      </div>

      <div className="grid gap-[22px] lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] xl:gap-[26px]">
        <Section title="OS Distribution">
          <OsDistribution devices={devices} />
        </Section>
        <Section title="Protection Coverage">
          <Panel className="flex h-full flex-col justify-center gap-[18px] p-[18px] xl:p-[24px]">
            {coverage.map((c, i) => (
              <div key={c.label} className="flex flex-col gap-[7px]">
                <span className="flex items-center justify-between text-[13px]">
                  <span className="text-bd-text">{c.label}</span>
                  <span className="text-bd-muted tabular-nums">{c.value}%</span>
                </span>
                <span className="h-[6px] overflow-hidden rounded-full bg-bd-input">
                  <motion.span
                    className={c.value >= 80 ? "block h-full rounded-full bg-bd-green" : c.value >= 50 ? "block h-full rounded-full bg-bd-orange" : "block h-full rounded-full bg-bd-red"}
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                  />
                </span>
              </div>
            ))}
          </Panel>
        </Section>
      </div>

      <Section title="Endpoints">
        <div className="mb-[16px] flex flex-col gap-[14px] lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 lg:flex-1">
            <FilterTabs tabs={TABS} value={tab} onChange={setTab} layoutId="devices-tab" counts={counts} />
          </div>
          <div className="flex gap-[10px]">
            <SearchBox value={query} onChange={setQuery} placeholder="Search hostname, user, OS…" className="min-w-0 flex-1 lg:w-[260px] lg:flex-none" />
            <button type="button" onClick={() => setEnroll((e) => ({ open: true, key: e.key + 1 }))} className={primaryBtn}>
              <Plus className="size-[16px]" />
              <span className="max-sm:sr-only">Enroll device</span>
            </button>
          </div>
        </div>

        {filtered.length ? (
          <motion.div key={`${tab}-${query}`} variants={listContainer} initial="hidden" animate="show" className="grid gap-[16px] sm:grid-cols-2 xl:grid-cols-3 xl:gap-[22px]">
            {filtered.map((d) => (
              <DeviceCard
                key={d.id}
                device={d}
                scanning={scanning.has(d.id)}
                onIsolate={() => setConfirm({ kind: "isolate", device: d })}
                onRelease={() => release(d)}
                onScan={() => scan(d)}
                onRemove={() => setConfirm({ kind: "remove", device: d })}
              />
            ))}
          </motion.div>
        ) : (
          <Panel hover={false}>
            <EmptyState icon={Laptop} title="No devices found">
              {query || tab !== "All" ? "Try a different search or status filter." : "Enroll your first device to start protecting it."}
            </EmptyState>
          </Panel>
        )}
      </Section>

      <EnrollDialog key={enroll.key} open={enroll.open} onOpenChange={(open) => setEnroll((e) => ({ ...e, open }))} />
      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm?.kind === "isolate" ? "Isolate device?" : "Remove device?"}
        description={
          confirm?.kind === "isolate"
            ? `${confirm.device.name} will be cut off from the network until you release it. ${confirm.device.user} keeps access to local files only.`
            : confirm
              ? `${confirm.device.name} will stop being monitored and the agent will be uninstalled on its next check-in.`
              : ""
        }
        confirmLabel={confirm?.kind === "isolate" ? "Isolate" : "Remove"}
        destructive
        onConfirm={onConfirm}
      />
    </Stagger>
  );
}
