"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { BdDialog, Shake, Spinner, outlineBtn, primaryBtn, useFakeSubmit } from "@/components/shared/dialog-kit";
import { Field, SelectField, TextInput, fieldBox } from "@/components/shared/form-controls";
import { SEVERITIES, useApp, type Incident, type Severity } from "@/lib/store";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"title" | "affected" | "summary", string>>;

/** "Report incident" form. Calls onCreated with the new incident after the simulated submit. */
export function ReportIncidentDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated?: (i: Incident) => void }) {
  const members = useApp((s) => s.members);
  const me = useApp((s) => s.user.name);
  const ids = { title: useId(), affected: useId(), summary: useId() };
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<Severity>("High");
  const [owner, setOwner] = useState(me);
  const [affected, setAffected] = useState("1");
  const [summary, setSummary] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [shake, setShake] = useState(0);
  const { loading, run } = useFakeSubmit();

  const owners = [...new Set([me, ...members.filter((m) => m.status === "Active").map((m) => m.name)])];

  const resetForm = () => {
    setTitle("");
    setSeverity("High");
    setOwner(me);
    setAffected("1");
    setSummary("");
    setErrors({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(affected);
    const next: Errors = {};
    if (title.trim().length < 4) next.title = "Give the incident a short descriptive title";
    if (!Number.isInteger(n) || n < 1) next.affected = "Enter a whole number of at least 1";
    if (summary.trim().length < 10) next.summary = "Describe what happened (at least 10 characters)";
    setErrors(next);
    if (Object.keys(next).length) return setShake((k) => k + 1);
    run(() => {
      const incident = useApp.getState().addIncident({ title: title.trim(), severity, owner, affectedAssets: n, summary: summary.trim() });
      toast.success(`${incident.ref} opened and assigned to ${owner}`);
      resetForm();
      onOpenChange(false);
      onCreated?.(incident);
    });
  };

  return (
    <BdDialog open={open} onOpenChange={onOpenChange} title="Report an incident" description="Open a case and start the response playbook.">
      <Shake shakeKey={shake}>
        <form onSubmit={submit} noValidate className="flex flex-col gap-[16px]">
          <Field label="Title" htmlFor={ids.title} error={errors.title}>
            <TextInput id={ids.title} value={title} invalid={!!errors.title} placeholder="e.g. Suspicious login to admin console" onChange={(e) => (setTitle(e.target.value), setErrors((x) => ({ ...x, title: undefined })))} />
          </Field>
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <Field label="Severity">
              <SelectField value={severity} onValueChange={(v) => setSeverity(v as Severity)} options={SEVERITIES.map((s) => ({ value: s, label: s }))} />
            </Field>
            <Field label="Owner">
              <SelectField value={owner} onValueChange={setOwner} options={owners.map((o) => ({ value: o, label: o }))} />
            </Field>
          </div>
          <Field label="Affected assets" htmlFor={ids.affected} error={errors.affected}>
            <TextInput id={ids.affected} type="number" min={1} inputMode="numeric" value={affected} invalid={!!errors.affected} onChange={(e) => (setAffected(e.target.value), setErrors((x) => ({ ...x, affected: undefined })))} />
          </Field>
          <Field label="Summary" htmlFor={ids.summary} error={errors.summary}>
            <textarea
              id={ids.summary}
              rows={4}
              value={summary}
              aria-invalid={!!errors.summary || undefined}
              placeholder="What was detected, where, and what has been done so far?"
              onChange={(e) => (setSummary(e.target.value), setErrors((x) => ({ ...x, summary: undefined })))}
              className={cn(fieldBox, "h-auto py-[10px] text-bd-primary placeholder:text-bd-placeholder xl:h-auto", errors.summary && "border-bd-red")}
            />
          </Field>
          <div className="mt-[4px] flex justify-end gap-[10px]">
            <button type="button" onClick={() => onOpenChange(false)} className={outlineBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading && <Spinner />} Open incident
            </button>
          </div>
        </form>
      </Shake>
    </BdDialog>
  );
}
