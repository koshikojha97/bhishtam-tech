"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SEVERITIES, useApp, type Preferences, type Severity } from "@/lib/store";
import { SelectField, type Option } from "@/components/shared/form-controls";
import { SeverityBadge } from "@/components/shared/security";
import { ControlField, SaveButton, SubHeading, ToggleRow } from "./fields";

const TIME_ZONES: Option[] = [
  "(GMT-12:00) International Date Line West",
  "(GMT-10:00) Hawaii",
  "(GMT-08:00) Pacific Time (US & Canada)",
  "(GMT-07:00) Mountain Time (US & Canada)",
  "(GMT-06:00) Central Time (US & Canada)",
  "(GMT-05:00) Eastern Time (US & Canada)",
  "(GMT-03:00) Brasilia",
  "(GMT+00:00) London, Dublin, Lisbon",
  "(GMT+01:00) Berlin, Paris, Rome, Madrid",
  "(GMT+02:00) Athens, Cairo, Johannesburg",
  "(GMT+03:00) Moscow, Istanbul, Riyadh",
  "(GMT+04:00) Abu Dhabi, Dubai",
  "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
  "(GMT+08:00) Singapore, Hong Kong, Beijing",
  "(GMT+09:00) Tokyo, Seoul",
  "(GMT+10:00) Sydney, Melbourne",
  "(GMT+12:00) Auckland, Wellington",
].map((z) => ({ value: z, label: z }));

const THRESHOLDS: Option[] = SEVERITIES.map((s) => ({ value: s, label: s === "Low" ? "Low (everything)" : `${s} and above` }));

const NOTIFICATIONS = [
  { key: "notifyCritical", label: "Critical threat alerts", description: "Instant email + push when a critical alert or incident is raised." },
  { key: "notifyWeeklyReport", label: "Weekly security report", description: "Score trend, top threats and patch status every Monday." },
  { key: "notifyProductUpdates", label: "Product updates", description: "New detections, integrations and service announcements." },
] as const;

export function PreferencesForm() {
  const prefs = useApp((s) => s.preferences);
  const updatePreferences = useApp((s) => s.updatePreferences);
  const notify = useApp((s) => s.notify);
  const [p, setP] = useState<Preferences>(prefs);

  // sync with the persisted store after rehydration / save
  useEffect(() => setP(prefs), [prefs]);

  const set = <K extends keyof Preferences>(k: K) => (v: Preferences[K]) => setP((s) => ({ ...s, [k]: v }));
  const covered = SEVERITIES.slice(0, SEVERITIES.indexOf(p.alertThreshold) + 1);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="mt-[24px] flex flex-col gap-[28px] xl:mt-[32px]">
      <section className="flex flex-col gap-[16px]">
        <SubHeading description="Used for timestamps, reports and on-call schedules.">Regional</SubHeading>
        <div className="grid gap-[16px] md:grid-cols-2 md:gap-x-[22px]">
          <ControlField label="Time zone" htmlFor="pref-timezone">
            <SelectField
              id="pref-timezone"
              value={p.timeZone}
              onValueChange={set("timeZone")}
              options={TIME_ZONES.some((z) => z.value === p.timeZone) ? TIME_ZONES : [{ value: p.timeZone, label: p.timeZone }, ...TIME_ZONES]}
            />
          </ControlField>
          <ControlField label="Alert threshold" htmlFor="pref-threshold" hint="Notify me for this severity and above.">
            <SelectField id="pref-threshold" value={p.alertThreshold} onValueChange={(v) => set("alertThreshold")(v as Severity)} options={THRESHOLDS} />
          </ControlField>
        </div>
        <div className="flex flex-wrap items-center gap-[8px] text-[12px] text-bd-muted">
          You&apos;ll be notified for:
          {covered.map((s) => (
            <SeverityBadge key={s} severity={s} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-[16px]">
        <SubHeading description="Choose what lands in your inbox.">Notifications</SubHeading>
        <div className="flex flex-col gap-[10px]">
          {NOTIFICATIONS.map((n) => (
            <ToggleRow key={n.key} label={n.label} description={n.description} checked={p[n.key]} onCheckedChange={set(n.key)} />
          ))}
        </div>
      </section>

      <SaveButton
        onSave={() => {
          updatePreferences(p);
          notify({ title: "Preferences updated", body: `Alerts for ${p.alertThreshold} and above`, kind: "info", href: "/dashboard/settings?tab=preferences" });
          toast.success("Preferences saved");
        }}
      />
    </form>
  );
}
