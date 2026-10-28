"use client";

import { motion } from "framer-motion";
import { Lock, LockOpen, Radar, ShieldBan, ShieldCheck, Trash2 } from "lucide-react";
import { Panel } from "@/components/shared/section";
import { StatusBadge } from "@/components/shared/security";
import { listItem } from "@/components/shared/motion";
import { timeAgo, type Device } from "@/lib/store";
import { cn } from "@/lib/utils";
import { KIND_ICON } from "./device-meta";

const actionBtn =
  "inline-flex h-[34px] items-center justify-center gap-[6px] rounded-[8px] border border-bd-card-border px-[10px] text-[12px] font-medium text-bd-primary transition-colors hover:border-bd-royal hover:text-bd-royal disabled:pointer-events-none disabled:opacity-50 xl:text-[13px]";

export function DeviceCard({
  device: d,
  scanning,
  onIsolate,
  onRelease,
  onScan,
  onRemove,
}: {
  device: Device;
  scanning: boolean;
  onIsolate: () => void;
  onRelease: () => void;
  onScan: () => void;
  onRemove: () => void;
}) {
  const Icon = KIND_ICON[d.kind];
  const isolated = d.status === "Isolated";
  return (
    <motion.div variants={listItem} layout className="h-full">
      <Panel className={cn("flex h-full flex-col gap-[16px] p-[18px] xl:p-[20px]", isolated && "border-dashed")}>
        <div className="flex items-start gap-[12px]">
          <span
            className={cn(
              "flex size-[44px] shrink-0 items-center justify-center rounded-[8px]",
              d.status === "At risk" ? "bg-bd-tint-red text-bd-red" : isolated ? "bg-bd-input text-bd-muted" : "bg-bd-tint-royal text-bd-royal",
            )}
          >
            <Icon className="size-[22px]" strokeWidth={1.6} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium text-bd-primary xl:text-[15px]">{d.name}</p>
            <p className="truncate text-[12px] text-bd-muted xl:text-[13px]">
              {d.user} · {d.os}
            </p>
          </div>
          <StatusBadge status={d.status} className="shrink-0" />
        </div>

        <dl className="grid grid-cols-2 gap-x-[12px] gap-y-[10px] rounded-[8px] border border-bd-border p-[12px] text-[12px] xl:text-[13px]">
          <div>
            <dt className="text-bd-muted">Encryption</dt>
            <dd className={cn("mt-[2px] flex items-center gap-[5px] font-medium", d.encrypted ? "text-bd-green" : "text-bd-orange")}>
              {d.encrypted ? <Lock className="size-[13px]" /> : <LockOpen className="size-[13px]" />}
              {d.encrypted ? "Enabled" : "Disabled"}
            </dd>
          </div>
          <div>
            <dt className="text-bd-muted">Threats (30d)</dt>
            <dd className={cn("mt-[2px] font-medium tabular-nums", d.threats ? "text-bd-red" : "text-bd-primary")}>{d.threats}</dd>
          </div>
          <div>
            <dt className="text-bd-muted">Agent</dt>
            <dd className="mt-[2px] font-medium text-bd-primary">v{d.agentVersion}</dd>
          </div>
          <div>
            <dt className="text-bd-muted">Last seen</dt>
            <dd className="mt-[2px] font-medium text-bd-primary">{scanning ? <span className="text-bd-royal">Scanning…</span> : timeAgo(d.lastSeen)}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap gap-[8px]">
          {isolated ? (
            <button type="button" onClick={onRelease} className={actionBtn}>
              <ShieldCheck className="size-[14px]" /> Release
            </button>
          ) : (
            <button type="button" onClick={onIsolate} className={actionBtn}>
              <ShieldBan className="size-[14px]" /> Isolate
            </button>
          )}
          <button type="button" onClick={onScan} disabled={scanning || isolated} className={actionBtn}>
            <Radar className={cn("size-[14px]", scanning && "animate-spin")} /> {scanning ? "Scanning" : "Scan"}
          </button>
          <button type="button" onClick={onRemove} aria-label={`Remove ${d.name}`} className={cn(actionBtn, "ml-auto px-[9px] hover:border-bd-red hover:text-bd-red")}>
            <Trash2 className="size-[14px]" />
          </button>
        </div>
      </Panel>
    </motion.div>
  );
}
