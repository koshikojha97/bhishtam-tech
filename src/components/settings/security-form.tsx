"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Monitor, RotateCcw, Smartphone, Tablet } from "lucide-react";
import { toast } from "sonner";
import { useApp, timeAgo } from "@/lib/store";
import { ConfirmDialog, dangerBtn, outlineBtn } from "@/components/shared/dialog-kit";
import { Pill } from "@/components/shared/security";
import { cn } from "@/lib/utils";
import { PasswordStrength, SaveButton, SubHeading, TextField, ToggleRow } from "./fields";

type Errors = Partial<Record<"current" | "next" | "confirm", string>>;

/** Sample sign-in sessions (swap for your auth provider's session list). */
const SESSIONS = [
  { id: "s1", device: "Chrome on Windows", place: "San Jose, USA", icon: Monitor, minutesAgo: 0, current: true },
  { id: "s2", device: "Safari on iPhone 15", place: "San Jose, USA", icon: Smartphone, minutesAgo: 95 },
  { id: "s3", device: "Firefox on Ubuntu", place: "Bengaluru, India", icon: Monitor, minutesAgo: 60 * 26 },
  { id: "s4", device: "Bhishtam app on iPad", place: "London, UK", icon: Tablet, minutesAgo: 60 * 24 * 4 },
];

export function SecurityForm() {
  const twoFactor = useApp((s) => s.security.twoFactor);
  const passwordUpdatedAt = useApp((s) => s.security.passwordUpdatedAt);
  const updateSecurity = useApp((s) => s.updateSecurity);
  const notify = useApp((s) => s.notify);

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sessions, setSessions] = useState(SESSIONS);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (k: keyof typeof pwd) => (v: string) => {
    setPwd((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const toggle2fa = (v: boolean) => {
    updateSecurity({ twoFactor: v });
    notify({
      title: v ? "Two-factor enabled" : "Two-factor disabled",
      body: v ? "Sign-ins now require a verification code" : "Your account is less protected without 2FA",
      kind: "security",
      href: "/dashboard/settings?tab=security",
    });
    if (v) toast.success("Two-factor authentication enabled");
    else toast.warning("Two-factor authentication disabled");
  };

  const validate = () => {
    const n: Errors = {};
    if (!pwd.current) n.current = "Enter your current password";
    if (pwd.next.length < 8 || !/[A-Za-z]/.test(pwd.next) || !/\d/.test(pwd.next)) n.next = "Use 8+ characters with letters and numbers";
    else if (pwd.next === pwd.current) n.next = "New password must differ from the current one";
    if (!pwd.confirm || pwd.confirm !== pwd.next) n.confirm = "Passwords do not match";
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const signOut = (id: string, device: string) => {
    setSessions((s) => s.filter((x) => x.id !== id));
    notify({ title: "Session signed out", body: device, kind: "security", href: "/dashboard/settings?tab=security" });
    toast.success(`Signed out of ${device}`);
  };

  const others = sessions.filter((s) => !s.current);

  return (
    <div className="mt-[24px] flex flex-col gap-[30px] xl:mt-[32px]">
      <section className="flex flex-col gap-[14px]">
        <SubHeading description="Require a verification code from your authenticator app at every sign-in.">Two-factor authentication</SubHeading>
        <ToggleRow
          label={twoFactor ? "Enabled" : "Disabled"}
          description={twoFactor ? "Your account is protected with 2FA." : "Turn this on — accounts without 2FA are the #1 phishing target."}
          checked={twoFactor}
          onCheckedChange={toggle2fa}
        />
      </section>

      <form onSubmit={(e) => e.preventDefault()} noValidate className="flex flex-col gap-[16px]">
        <SubHeading description={passwordUpdatedAt ? `Last changed ${timeAgo(passwordUpdatedAt)}.` : "Use a unique password you don't use anywhere else."}>Change password</SubHeading>
        <div className="flex flex-col gap-[16px] md:w-[calc(50%-11px)]">
          <TextField label="Current password" type="password" value={pwd.current} onChange={set("current")} placeholder="••••••••••" autoComplete="current-password" error={errors.current} />
          <div className="flex flex-col gap-[8px]">
            <TextField label="New password" type="password" value={pwd.next} onChange={set("next")} placeholder="••••••••••" autoComplete="new-password" error={errors.next} />
            <PasswordStrength value={pwd.next} />
          </div>
          <TextField label="Confirm new password" type="password" value={pwd.confirm} onChange={set("confirm")} placeholder="••••••••••" autoComplete="new-password" error={errors.confirm} />
        </div>
        <SaveButton
          label="Update password"
          onValidate={validate}
          onSave={() => {
            updateSecurity({ passwordUpdatedAt: new Date().toISOString() });
            notify({ title: "Password changed", body: "Your account password was updated", kind: "security", href: "/dashboard/settings?tab=security" });
            toast.success("Password updated");
            setPwd({ current: "", next: "", confirm: "" });
          }}
        />
      </form>

      <section className="flex flex-col gap-[14px]">
        <div className="flex flex-wrap items-end justify-between gap-[12px]">
          <SubHeading description="Devices currently signed in to your account.">Active sessions</SubHeading>
          {others.length > 0 && (
            <button type="button" onClick={() => others.forEach((s) => signOut(s.id, s.device))} className={cn(outlineBtn, "h-[36px] px-[14px] text-[13px] xl:h-[38px] xl:text-[13px]")}>
              Sign out all others
            </button>
          )}
        </div>
        <ul className="flex flex-col divide-y divide-bd-border rounded-[8px] border border-bd-border">
          <AnimatePresence initial={false}>
            {sessions.map((s) => (
              <motion.li
                key={s.id}
                layout
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-[12px] overflow-hidden px-[14px] py-[12px] xl:px-[16px]"
              >
                <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[8px] bg-bd-input text-bd-muted">
                  <s.icon className="size-[18px]" strokeWidth={1.7} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-[8px] text-[13px] text-bd-primary xl:text-[14px]">
                    {s.device}
                    {s.current && <Pill tone="green">This device</Pill>}
                  </span>
                  <span className="mt-[2px] block truncate text-[12px] text-bd-muted">
                    {s.place} · {s.current ? "Active now" : timeAgo(new Date(Date.now() - s.minutesAgo * 60_000).toISOString())}
                  </span>
                </span>
                {!s.current && (
                  <button
                    type="button"
                    onClick={() => signOut(s.id, s.device)}
                    aria-label={`Sign out ${s.device}`}
                    className="flex shrink-0 items-center gap-[6px] rounded-[6px] px-[8px] py-[6px] text-[12px] text-bd-muted transition-colors hover:bg-bd-tint-red-soft hover:text-bd-red xl:text-[13px]"
                  >
                    <LogOut className="size-[14px]" />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>

      <section className="flex flex-col gap-[14px] rounded-[8px] border border-bd-red/30 bg-bd-tint-red-soft p-[16px] xl:p-[20px]">
        <SubHeading description="Restores the sample alerts, assets, devices, incidents, team and settings. Can't be undone.">Danger zone</SubHeading>
        <button type="button" onClick={() => setConfirmReset(true)} className={cn(dangerBtn, "self-start")}>
          <RotateCcw className="size-[16px]" />
          Reset demo data
        </button>
      </section>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset all demo data?"
        description="Every change you've made — alerts, incidents, devices, team members and settings — will be replaced with the original sample data."
        confirmLabel="Reset data"
        destructive
        onConfirm={() => {
          useApp.getState().reset();
          setSessions(SESSIONS);
          toast.success("Demo data reset");
        }}
      />
    </div>
  );
}
