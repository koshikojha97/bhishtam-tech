"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ROLES, useApp, type Role } from "@/lib/store";
import { BdDialog, Shake, Spinner, outlineBtn, primaryBtn, useFakeSubmit } from "@/components/shared/dialog-kit";
import { Field, SelectField, TextInput } from "@/components/shared/form-controls";
import { ROLE_INFO } from "./role-matrix";

type Errors = Partial<Record<"name" | "email", string>>;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Invite a teammate: name, email, role → store.inviteMember + notification. */
export function InviteDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const members = useApp((s) => s.members);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Analyst");
  const [errors, setErrors] = useState<Errors>({});
  const [shake, setShake] = useState(0);
  const { loading, run } = useFakeSubmit();

  const close = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setName("");
      setEmail("");
      setRole("Analyst");
      setErrors({});
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n: Errors = {};
    if (name.trim().length < 2) n.name = "Enter their full name";
    if (!isEmail(email)) n.email = "Enter a valid email address";
    else if (members.some((m) => m.email.toLowerCase() === email.trim().toLowerCase())) n.email = "This person is already on the team";
    setErrors(n);
    if (Object.keys(n).length) return setShake((k) => k + 1);
    run(() => {
      const m = useApp.getState().inviteMember({ name: name.trim(), email: email.trim(), role });
      useApp.getState().notify({ title: "Invitation sent", body: `${m.name} was invited as ${m.role}`, kind: "info", href: "/dashboard/access" });
      toast.success(`Invitation sent to ${m.email}`);
      close(false);
    });
  };

  return (
    <BdDialog open={open} onOpenChange={close} title="Invite team member" description="They'll get an email to join your Bhishtam Tech workspace.">
      <Shake shakeKey={shake}>
        <form onSubmit={submit} noValidate className="flex flex-col gap-[16px]">
          <Field label="Full name" htmlFor="invite-name" error={errors.name}>
            <TextInput id="invite-name" value={name} onChange={(e) => (setName(e.target.value), setErrors((x) => ({ ...x, name: undefined })))} placeholder="Jane Cooper" invalid={!!errors.name} autoFocus />
          </Field>
          <Field label="Work email" htmlFor="invite-email" error={errors.email}>
            <TextInput id="invite-email" type="email" value={email} onChange={(e) => (setEmail(e.target.value), setErrors((x) => ({ ...x, email: undefined })))} placeholder="jane@company.com" invalid={!!errors.email} />
          </Field>
          <Field label="Role" htmlFor="invite-role">
            <SelectField id="invite-role" value={role} onValueChange={(v) => setRole(v as Role)} options={ROLES.map((r) => ({ value: r, label: r }))} />
            <p className="text-[12px] leading-[1.5] text-bd-muted">{ROLE_INFO[role]}</p>
          </Field>
          <div className="mt-[6px] flex justify-end gap-[10px]">
            <button type="button" onClick={() => close(false)} className={outlineBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading && <Spinner />}
              Send invite
            </button>
          </div>
        </form>
      </Shake>
    </BdDialog>
  );
}
