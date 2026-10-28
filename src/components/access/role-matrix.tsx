"use client";

import { Check, Minus } from "lucide-react";
import { Panel } from "@/components/shared/section";
import { ROLES, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

/** One-line summary of each role (shown in the invite dialog). */
export const ROLE_INFO: Record<Role, string> = {
  Admin: "Full access, including team management and billing.",
  Analyst: "Triages alerts and investigates incidents. Can't change infrastructure.",
  Responder: "Handles incidents end-to-end and can isolate devices.",
  Viewer: "Read-only access to dashboards and reports.",
};

const CAPABILITIES: { label: string; roles: Role[] }[] = [
  { label: "View dashboards", roles: ["Admin", "Analyst", "Responder", "Viewer"] },
  { label: "Triage alerts", roles: ["Admin", "Analyst", "Responder"] },
  { label: "Manage incidents", roles: ["Admin", "Analyst", "Responder"] },
  { label: "Isolate devices", roles: ["Admin", "Responder"] },
  { label: "Manage assets", roles: ["Admin"] },
  { label: "Manage team & billing", roles: ["Admin"] },
];

/** Roles × capabilities matrix. */
export function RoleMatrix() {
  return (
    <Panel hover={false} className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr>
            <th className="px-[16px] py-[12px] text-[12px] font-medium tracking-wide text-bd-muted uppercase xl:px-[20px]">Capability</th>
            {ROLES.map((r) => (
              <th key={r} className="px-[10px] py-[12px] text-center text-[12px] font-medium tracking-wide text-bd-muted uppercase">
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAPABILITIES.map((c) => (
            <tr key={c.label} className="border-t border-bd-border">
              <td className="px-[16px] py-[12px] text-[13px] text-bd-text xl:px-[20px] xl:text-[14px]">{c.label}</td>
              {ROLES.map((r) => {
                const ok = c.roles.includes(r);
                return (
                  <td key={r} className="px-[10px] py-[12px] text-center">
                    <span
                      aria-label={ok ? `${r}: allowed` : `${r}: not allowed`}
                      className={cn("inline-flex size-[24px] items-center justify-center rounded-[6px]", ok ? "bg-bd-tint-royal text-bd-royal" : "text-bd-placeholder")}
                    >
                      {ok ? <Check className="size-[14px]" strokeWidth={2.4} /> : <Minus className="size-[14px]" />}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
