"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Download, Search, Siren } from "lucide-react";
import { toast } from "sonner";
import { BdDialog, DetailRows, outlineBtn, primaryBtn } from "@/components/shared/dialog-kit";
import { SeverityBadge, StatusBadge } from "@/components/shared/security";
import { downloadFile, reportHtml } from "@/lib/download";
import { fmtDate, useApp, type Alert } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Alert detail + triage actions (investigate, resolve, escalate, download report). */
export function AlertDetail({ alert, onOpenChange }: { alert: Alert | null; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  if (!alert) return null;
  const a = alert;
  const { updateAlert, addIncident, user } = useApp.getState();
  const close = () => onOpenChange(false);

  const investigate = () => {
    updateAlert(a.id, { status: "Investigating" });
    toast.info(`${a.ref} is under investigation`);
    close();
  };
  const resolve = () => {
    updateAlert(a.id, { status: "Resolved" });
    toast.success(`${a.ref} marked resolved`);
    close();
  };
  const escalate = () => {
    const incident = addIncident({
      title: a.title,
      severity: a.severity,
      owner: user.name,
      affectedAssets: 1,
      summary: `Escalated from alert ${a.ref} (${a.category}) on ${a.asset}. Source ${a.ip} (${a.country}), detected by ${a.source}.`,
    });
    if (a.status === "Open") updateAlert(a.id, { status: "Investigating" });
    toast.success(`Escalated to ${incident.ref}`);
    close();
    router.push(`/dashboard/incidents?q=${encodeURIComponent(incident.ref)}`);
  };
  const download = () => {
    downloadFile(
      `${a.ref}.html`,
      reportHtml(`Alert ${a.ref}`, [
        ["Title", a.title],
        ["Category", a.category],
        ["Severity", a.severity],
        ["Status", a.status],
        ["Source", a.source],
        ["Asset", a.asset],
        ["Origin", `${a.ip} · ${a.country}`],
        ["Detected", fmtDate(a.date)],
      ]),
      "text/html;charset=utf-8",
    );
  };

  return (
    <BdDialog
      open
      onOpenChange={onOpenChange}
      title={a.title}
      description={
        <span className="flex flex-wrap items-center gap-[8px]">
          {a.ref} <SeverityBadge severity={a.severity} /> <StatusBadge status={a.status} />
        </span>
      }
      className="sm:max-w-[520px]"
    >
      <DetailRows
        rows={[
          ["Category", a.category],
          ["Detected by", a.source],
          ["Affected asset", a.asset],
          ["Origin IP", a.ip],
          ["Country", a.country],
          ["Detected", fmtDate(a.date)],
        ]}
      />
      <div className="mt-[20px] grid grid-cols-1 gap-[10px] sm:grid-cols-2">
        {a.status === "Open" && (
          <button type="button" onClick={investigate} className={outlineBtn}>
            <Search className="size-[16px]" /> Start investigation
          </button>
        )}
        {a.status !== "Resolved" && (
          <button type="button" onClick={resolve} className={outlineBtn}>
            <CheckCircle2 className="size-[16px]" /> Mark resolved
          </button>
        )}
        <button type="button" onClick={download} className={outlineBtn}>
          <Download className="size-[16px]" /> Download report
        </button>
        <button type="button" onClick={escalate} className={cn(primaryBtn, a.status === "Investigating" && "sm:col-span-2")}>
          <Siren className="size-[16px]" /> Escalate to incident
        </button>
      </div>
    </BdDialog>
  );
}
