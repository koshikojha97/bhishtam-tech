"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BdDialog, Shake, Spinner, outlineBtn, primaryBtn, useFakeSubmit } from "@/components/shared/dialog-kit";
import { CheckboxField, Field, SelectField, TextInput } from "@/components/shared/form-controls";
import { useApp, type Device } from "@/lib/store";
import { DEVICE_KINDS, OS_OPTIONS } from "./device-meta";

type Form = { name: string; user: string; kind: Device["kind"]; os: string; encrypted: boolean };
type Errors = Partial<Record<"name" | "user", string>>;

const EMPTY: Form = { name: "", user: "", kind: "Laptop", os: OS_OPTIONS.Laptop[0], encrypted: true };

/** Enroll a new endpoint. Remount (key) per open so the form resets. */
export function EnrollDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [shake, setShake] = useState(0);
  const { loading, run } = useFakeSubmit(900);

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Errors = {};
    const name = form.name.trim().toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9-]{2,30}$/.test(name)) e.name = "Use 3–31 letters, numbers or dashes";
    else if (useApp.getState().devices.some((d) => d.name.toUpperCase() === name)) e.name = "A device with this hostname is already enrolled";
    if (form.user.trim().length < 2) e.user = "Enter who uses this device";
    setErrors(e);
    if (Object.keys(e).length) return setShake((n) => n + 1);
    run(() => {
      useApp.getState().addDevice({ name, user: form.user.trim(), kind: form.kind, os: form.os, encrypted: form.encrypted });
      toast.success(`${name} enrolled — agent installed`);
      onOpenChange(false);
    });
  };

  return (
    <BdDialog open={open} onOpenChange={onOpenChange} title="Enroll device" description="Install the endpoint agent and start protecting a device.">
      <Shake shakeKey={shake}>
        <form onSubmit={submit} noValidate className="flex flex-col gap-[16px]">
          <Field label="Hostname" htmlFor="dev-name" error={errors.name}>
            <TextInput
              id="dev-name"
              value={form.name}
              onChange={(e) => (setForm((f) => ({ ...f, name: e.target.value })), setErrors((x) => ({ ...x, name: undefined })))}
              placeholder="ENG-LT-012"
              invalid={!!errors.name}
              autoFocus
            />
          </Field>
          <Field label="Assigned user" htmlFor="dev-user" error={errors.user}>
            <TextInput
              id="dev-user"
              value={form.user}
              onChange={(e) => (setForm((f) => ({ ...f, user: e.target.value })), setErrors((x) => ({ ...x, user: undefined })))}
              placeholder="Jane Cooper"
              invalid={!!errors.user}
            />
          </Field>
          <div className="grid gap-[16px] sm:grid-cols-2">
            <Field label="Device type">
              <SelectField
                value={form.kind}
                onValueChange={(v) => {
                  const kind = v as Device["kind"];
                  setForm((f) => ({ ...f, kind, os: OS_OPTIONS[kind].includes(f.os) ? f.os : OS_OPTIONS[kind][0] }));
                }}
                options={DEVICE_KINDS.map((k) => ({ value: k, label: k }))}
              />
            </Field>
            <Field label="Operating system">
              <SelectField value={form.os} onValueChange={(os) => setForm((f) => ({ ...f, os }))} options={OS_OPTIONS[form.kind].map((o) => ({ value: o, label: o }))} />
            </Field>
          </div>
          <CheckboxField checked={form.encrypted} onCheckedChange={(encrypted) => setForm((f) => ({ ...f, encrypted }))}>
            Disk encryption is enabled
          </CheckboxField>
          <div className="mt-[6px] flex justify-end gap-[10px]">
            <button type="button" className={outlineBtn} onClick={() => onOpenChange(false)}>
              Cancel
            </button>
            <button type="submit" className={primaryBtn} disabled={loading}>
              {loading && <Spinner />}
              Enroll device
            </button>
          </div>
        </form>
      </Shake>
    </BdDialog>
  );
}
