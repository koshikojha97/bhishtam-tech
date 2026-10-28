"use client";

import { Download, ExternalLink, ShieldCheck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { BdDialog, DetailRows, outlineBtn, primaryBtn } from "@/components/shared/dialog-kit";
import { SeverityBadge, StatusBadge } from "@/components/shared/security";
import { downloadFile, reportHtml } from "@/lib/download";
import { fmtDate, useApp, type Vulnerability } from "@/lib/store";
import { cn } from "@/lib/utils";

/** CVSS score in a small chip, coloured by CVSS v3 band. */
export function CvssChip({ score }: { score: number }) {
  const cls = score >= 9 ? "border-bd-red/40 text-bd-red" : score >= 7 ? "border-[#d17a3f]/40 text-[#d17a3f]" : score >= 4 ? "border-bd-orange/40 text-bd-orange" : "border-bd-teal/40 text-bd-teal";
  return <span className={cn("inline-flex min-w-[40px] justify-center rounded-[6px] border px-[6px] py-[2px] text-[12px] font-medium tabular-nums xl:text-[13px]", cls)}>{score.toFixed(1)}</span>;
}

export function VulnDialog({ vuln, onOpenChange }: { vuln: Vulnerability | null; onOpenChange: (o: boolean) => void }) {
  const { updateVulnerability, notify } = useApp.getState();
  if (!vuln) return <BdDialog open={false} onOpenChange={onOpenChange} title="Vulnerability">{null}</BdDialog>;

  const remediate = () => {
    updateVulnerability(vuln.id, { status: "In progress" });
    toast.success(`Remediation started for ${vuln.cve}`);
  };
  const patch = () => {
    updateVulnerability(vuln.id, { status: "Patched" });
    notify({ title: `${vuln.cve} patched`, body: `${vuln.title} fixed on ${vuln.asset}`, kind: "vulnerability", href: "/dashboard/vulnerabilities" });
    toast.success(`${vuln.cve} marked as patched`);
    onOpenChange(false);
  };
  const download = () => {
    const html = reportHtml(`${vuln.cve} — ${vuln.title}`, [
      ["CVE", vuln.cve],
      ["Severity", vuln.severity],
      ["CVSS score", vuln.cvss.toFixed(1)],
      ["Affected asset", vuln.asset],
      ["Fix available", vuln.fixAvailable ? "Yes" : "No"],
      ["Status", vuln.status],
      ["Discovered", fmtDate(vuln.discovered)],
    ]);
    downloadFile(`${vuln.cve}-report.html`, html, "text/html;charset=utf-8");
  };

  return (
    <BdDialog open onOpenChange={onOpenChange} title={vuln.cve} description={vuln.title} className="sm:max-w-[520px]">
      <div className="flex flex-col gap-[18px]">
        <div className="flex flex-wrap items-center gap-[8px]">
          <SeverityBadge severity={vuln.severity} />
          <StatusBadge status={vuln.status} />
          <CvssChip score={vuln.cvss} />
        </div>
        <DetailRows
          rows={[
            ["Affected asset", vuln.asset],
            ["Fix available", vuln.fixAvailable ? "Yes — vendor patch released" : "No — apply mitigations"],
            ["Discovered", fmtDate(vuln.discovered)],
            [
              "NVD entry",
              <a key="nvd" href={`https://nvd.nist.gov/vuln/detail/${vuln.cve}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[4px] text-bd-royal hover:underline">
                View on NVD <ExternalLink className="size-[12px]" />
              </a>,
            ],
          ]}
        />
        <div className="flex flex-col gap-[10px] sm:flex-row sm:flex-wrap sm:justify-end">
          <button type="button" onClick={download} className={outlineBtn}>
            <Download className="size-[16px]" /> Download report
          </button>
          {vuln.status === "Open" && (
            <button type="button" onClick={remediate} className={outlineBtn}>
              <Wrench className="size-[16px]" /> Start remediation
            </button>
          )}
          {vuln.status !== "Patched" && (
            <button type="button" onClick={patch} className={primaryBtn}>
              <ShieldCheck className="size-[16px]" /> Mark patched
            </button>
          )}
        </div>
      </div>
    </BdDialog>
  );
}
