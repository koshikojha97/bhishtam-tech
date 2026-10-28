"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { BdDialog, DetailRows } from "@/components/shared/dialog-kit";
import { SelectField } from "@/components/shared/form-controls";
import { STATUS_TONE, SeverityBadge, StatusBadge, toneBg, toneText } from "@/components/shared/security";
import { fmtDate, timeAgo, useApp, type Incident, type IncidentStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Response playbook; each completed step is worth 20% of `progress` (steps complete in order). */
export const PLAYBOOK = ["Identify", "Contain", "Eradicate", "Recover", "Lessons learned"] as const;
const STEP = 100 / PLAYBOOK.length;
export const stepsDone = (progress: number) => Math.round(progress / STEP);

const STATUSES: IncidentStatus[] = ["Open", "Contained", "Resolved"];

export function IncidentDetail({ incident, onOpenChange }: { incident: Incident | null; onOpenChange: (o: boolean) => void }) {
  const members = useApp((s) => s.members);
  if (!incident) return null;
  const inc = incident;
  const { updateIncident } = useApp.getState();
  const done = stepsDone(inc.progress);
  const owners = [...new Set([inc.owner, ...members.filter((m) => m.status === "Active").map((m) => m.name)])];

  const toggleStep = (i: number) => {
    const progress = Math.round((i < done ? i : i + 1) * STEP);
    updateIncident(inc.id, { progress });
  };
  const setStatus = (status: IncidentStatus) => {
    if (status === inc.status) return;
    updateIncident(inc.id, { status, ...(status === "Resolved" ? { progress: 100 } : {}) });
    toast.success(`${inc.ref} marked ${status.toLowerCase()}`);
  };
  const setOwner = (owner: string) => {
    updateIncident(inc.id, { owner });
    toast.info(`${inc.ref} reassigned to ${owner}`);
  };

  return (
    <BdDialog
      open
      onOpenChange={onOpenChange}
      title={inc.title}
      description={
        <span className="flex flex-wrap items-center gap-[8px]">
          {inc.ref} <SeverityBadge severity={inc.severity} /> <StatusBadge status={inc.status} />
        </span>
      }
      className="sm:max-w-[560px]"
    >
      <div className="flex flex-col gap-[20px]">
        <p className="text-[13px] leading-[1.6] text-bd-text xl:text-[14px]">{inc.summary}</p>

        <DetailRows
          rows={[
            ["Opened", fmtDate(inc.opened)],
            ["Last update", timeAgo(inc.updated)],
            ["Affected assets", String(inc.affectedAssets)],
          ]}
        />

        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-bd-muted">Response playbook</span>
            <span className="text-bd-primary tabular-nums">{inc.progress}%</span>
          </div>
          <span className="h-[6px] overflow-hidden rounded-full bg-bd-input">
            <motion.span className="block h-full rounded-full bg-bd-royal" animate={{ width: `${inc.progress}%` }} transition={{ duration: 0.4 }} />
          </span>
          <ol className="flex flex-col gap-[6px]">
            {PLAYBOOK.map((step, i) => {
              const checked = i < done;
              return (
                <li key={step}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggleStep(i)}
                    className="flex w-full items-center gap-[10px] rounded-[6px] border border-bd-border px-[12px] py-[9px] text-left text-[13px] transition-colors hover:border-bd-card-border hover:bg-bd-icon-light"
                  >
                    <span className={cn("flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors", checked ? "border-bd-royal bg-bd-royal text-white" : "border-bd-card-border")}>
                      {checked && <Check className="size-[12px]" strokeWidth={3} />}
                    </span>
                    <span className="text-bd-muted tabular-nums">{i + 1}.</span>
                    <span className={cn(checked ? "text-bd-muted line-through" : "text-bd-primary")}>{step}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
          <div className="flex flex-col gap-[8px]">
            <span className="text-[13px] text-bd-muted">Status</span>
            <div role="radiogroup" aria-label="Status" className="grid grid-cols-3 gap-[6px]">
              {STATUSES.map((s) => {
                const active = s === inc.status;
                const tone = STATUS_TONE[s];
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "h-[40px] rounded-[8px] border text-[12px] font-medium transition-colors xl:text-[13px]",
                      active ? cn("border-transparent", toneBg(tone), toneText(tone)) : "border-bd-card-border text-bd-muted hover:text-bd-primary",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-[8px]">
            <span className="text-[13px] text-bd-muted">Owner</span>
            <SelectField value={inc.owner} onValueChange={setOwner} options={owners.map((o) => ({ value: o, label: o }))} className="xl:data-[size=default]:h-[40px]" />
          </div>
        </div>
      </div>
    </BdDialog>
  );
}
