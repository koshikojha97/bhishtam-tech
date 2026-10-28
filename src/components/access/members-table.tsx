"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, MoreHorizontal, PauseCircle, PlayCircle, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Panel } from "@/components/shared/section";
import { SelectField } from "@/components/shared/form-controls";
import { ConfirmDialog } from "@/components/shared/dialog-kit";
import { EmptyState, Pill, tableCls, tableWrap, tdCls, thCls, trCls, type Tone } from "@/components/shared/security";
import { ROLES, timeAgo, useApp, type Member, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<Member["status"], Tone> = { Active: "green", Invited: "yellow", Suspended: "muted" };

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** Team members with inline role changes and row actions. `query` filters by name/email/role. */
export function MembersTable({ query }: { query: string }) {
  const members = useApp((s) => s.members);
  const meEmail = useApp((s) => s.user.email);
  const [removing, setRemoving] = useState<Member | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? members.filter((m) => `${m.name} ${m.email} ${m.role} ${m.status}`.toLowerCase().includes(q)) : members;
  }, [members, query]);

  const activeAdmins = members.filter((m) => m.role === "Admin" && m.status !== "Suspended").length;
  const isLastAdmin = (m: Member) => m.role === "Admin" && m.status !== "Suspended" && activeAdmins <= 1;
  const isMe = (m: Member) => m.email.toLowerCase() === meEmail.toLowerCase();

  const changeRole = (m: Member, role: Role) => {
    if (role === m.role) return;
    if (isLastAdmin(m)) return toast.error("Your workspace needs at least one Admin");
    useApp.getState().updateMember(m.id, { role });
    toast.success(`${m.name} is now ${role === "Admin" || role === "Analyst" ? "an" : "a"} ${role}`);
  };

  const toggleSuspend = (m: Member) => {
    if (m.status === "Suspended") {
      useApp.getState().updateMember(m.id, { status: "Active" });
      return toast.success(`${m.name} was reactivated`);
    }
    if (isMe(m)) return toast.error("You can't suspend yourself");
    if (isLastAdmin(m)) return toast.error("Your workspace needs at least one active Admin");
    useApp.getState().updateMember(m.id, { status: "Suspended" });
    useApp.getState().notify({ title: "Member suspended", body: `${m.name} can no longer sign in`, kind: "security", href: "/dashboard/access" });
    toast.success(`${m.name} was suspended`);
  };

  const remind = (m: Member) => toast.success(`MFA setup reminder sent to ${m.email}`);

  return (
    <Panel hover={false}>
      {rows.length === 0 ? (
        <EmptyState icon={Users} title="No members found">
          Try a different name, email or role.
        </EmptyState>
      ) : (
        <div className={tableWrap}>
          <table className={cn(tableCls, "min-w-[820px]")}>
            <thead>
              <tr>
                <th className={thCls}>Member</th>
                <th className={thCls}>Role</th>
                <th className={thCls}>MFA</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Last active</th>
                <th className={cn(thCls, "w-[56px]")}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map((m, i) => (
                  <motion.tr
                    key={m.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.04 } }}
                    exit={{ opacity: 0 }}
                    className={cn(trCls, m.status === "Suspended" && "opacity-60")}
                  >
                    <td className={tdCls}>
                      <span className="flex items-center gap-[12px]">
                        <Avatar className="size-[38px] border border-bd-card-border">
                          {m.avatar && <AvatarImage src={m.avatar} alt={m.name} className="object-cover" />}
                          <AvatarFallback className="bg-bd-input text-[12px] font-medium text-bd-primary">{initials(m.name)}</AvatarFallback>
                        </Avatar>
                        <span className="min-w-0">
                          <span className="flex items-center gap-[8px] font-medium text-bd-primary">
                            {m.name}
                            {isMe(m) && <span className="rounded-[4px] border border-bd-card-border px-[5px] text-[11px] font-normal text-bd-muted">You</span>}
                          </span>
                          <span className="block truncate text-[12px] text-bd-muted">{m.email}</span>
                        </span>
                      </span>
                    </td>
                    <td className={tdCls}>
                      <SelectField
                        value={m.role}
                        onValueChange={(v) => changeRole(m, v as Role)}
                        options={ROLES.map((r) => ({ value: r, label: r }))}
                        className="w-[132px] data-[size=default]:h-[34px] xl:data-[size=default]:h-[36px]"
                      />
                    </td>
                    <td className={tdCls}>
                      <span className="flex items-center gap-[8px]">
                        <Pill tone={m.mfa ? "green" : "red"}>{m.mfa ? "Enabled" : "Not enabled"}</Pill>
                        {!m.mfa && m.status !== "Suspended" && (
                          <button type="button" onClick={() => remind(m)} className="text-[12px] text-bd-muted underline-offset-4 transition-colors hover:text-bd-royal hover:underline">
                            Remind
                          </button>
                        )}
                      </span>
                    </td>
                    <td className={tdCls}>
                      <Pill tone={STATUS_TONE[m.status]}>{m.status}</Pill>
                    </td>
                    <td className={cn(tdCls, "whitespace-nowrap text-bd-muted")}>{m.status === "Invited" ? `Invited ${timeAgo(m.lastActive)}` : timeAgo(m.lastActive)}</td>
                    <td className={tdCls}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" aria-label={`Actions for ${m.name}`} className="flex size-[32px] items-center justify-center rounded-[6px] text-bd-muted transition-colors hover:bg-bd-input hover:text-bd-primary">
                            <MoreHorizontal className="size-[18px]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[190px] rounded-[8px] border-bd-border p-[6px]">
                          {!m.mfa && m.status !== "Suspended" && (
                            <DropdownMenuItem onSelect={() => remind(m)} className="cursor-pointer rounded-[6px] text-[13px] focus:bg-bd-input">
                              <BellRing className="size-[15px]" /> Send MFA reminder
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onSelect={() => toggleSuspend(m)} className="cursor-pointer rounded-[6px] text-[13px] focus:bg-bd-input">
                            {m.status === "Suspended" ? <PlayCircle className="size-[15px]" /> : <PauseCircle className="size-[15px]" />}
                            {m.status === "Suspended" ? "Reactivate" : "Suspend"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={isMe(m)}
                            onSelect={() => (isLastAdmin(m) ? toast.error("Your workspace needs at least one Admin") : setRemoving(m))}
                            className="cursor-pointer rounded-[6px] text-[13px] text-bd-red focus:bg-bd-tint-red-soft focus:text-bd-red"
                          >
                            <Trash2 className="size-[15px] text-bd-red" /> {isMe(m) ? "Can't remove yourself" : "Remove"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={`Remove ${removing?.name ?? "member"}?`}
        description="They'll lose access to this workspace immediately. Incidents they own keep their history."
        confirmLabel="Remove member"
        destructive
        onConfirm={() => {
          if (!removing) return;
          useApp.getState().removeMember(removing.id);
          useApp.getState().notify({ title: "Member removed", body: `${removing.name} was removed from the team`, kind: "security", href: "/dashboard/access" });
          toast.success(`${removing.name} was removed`);
          setRemoving(null);
        }}
      />
    </Panel>
  );
}
