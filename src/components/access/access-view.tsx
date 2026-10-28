"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MailPlus, ShieldCheck, UserCog, UserPlus, Users } from "lucide-react";
import { Stagger } from "@/components/shared/motion";
import { Section } from "@/components/shared/section";
import { SearchBox, StatTile } from "@/components/shared/security";
import { primaryBtn } from "@/components/shared/dialog-kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { InviteDialog } from "./invite-dialog";
import { MembersTable } from "./members-table";
import { RoleMatrix } from "./role-matrix";

/** Opens the invite dialog when the page is visited with `?new=1` (command palette deep link), then cleans the URL. */
function NewParamOpener({ onOpen }: { onOpen: () => void }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (params.get("new") !== "1") return;
    onOpen();
    const sp = new URLSearchParams(params.toString());
    sp.delete("new");
    const q = sp.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [params, onOpen, router, pathname]);
  return null;
}

export function AccessView() {
  const members = useApp((s) => s.members);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const openInvite = useCallback(() => setInviteOpen(true), []);

  const active = members.filter((m) => m.status !== "Invited");
  const mfaPct = members.length ? Math.round((members.filter((m) => m.mfa).length / members.length) * 100) : 0;
  const admins = members.filter((m) => m.role === "Admin").length;
  const pending = members.filter((m) => m.status === "Invited").length;

  return (
    <Stagger className="flex flex-col gap-[22px] xl:gap-[26px]">
      <Suspense fallback={null}>
        <NewParamOpener onOpen={openInvite} />
      </Suspense>

      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4 xl:gap-[22px]">
        <StatTile icon={Users} tone="accent" label="Team members" value={members.length} hint={`${active.length} active`} />
        <StatTile icon={ShieldCheck} tone={mfaPct === 100 ? "green" : mfaPct >= 70 ? "yellow" : "red"} label="MFA coverage" value={mfaPct} suffix="%" hint={`${members.length - members.filter((m) => m.mfa).length} without MFA`} />
        <StatTile icon={UserCog} tone="teal" label="Admins" value={admins} hint="Full workspace access" />
        <StatTile icon={MailPlus} tone="yellow" label="Pending invites" value={pending} hint="Awaiting acceptance" />
      </div>

      <Section title="Team Members">
        <div className="mb-[14px] flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
          <SearchBox value={query} onChange={setQuery} placeholder="Search name, email or role…" className="w-full sm:w-[300px]" />
          <button type="button" onClick={() => setInviteOpen(true)} className={cn(primaryBtn, "w-full sm:w-auto")}>
            <UserPlus className="size-[16px]" />
            Invite member
          </button>
        </div>
        <MembersTable query={query} />
      </Section>

      <Section title="Role Permissions">
        <RoleMatrix />
      </Section>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </Stagger>
  );
}
