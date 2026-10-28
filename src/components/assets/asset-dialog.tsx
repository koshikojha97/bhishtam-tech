"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BdDialog, Shake, Spinner, outlineBtn, primaryBtn, useFakeSubmit } from "@/components/shared/dialog-kit";
import { Field, SelectField, TextInput } from "@/components/shared/form-controls";
import { useApp, type Asset, type AssetType } from "@/lib/store";
import { ASSET_TYPES, ENVIRONMENTS } from "./asset-meta";

type Form = { name: string; type: AssetType; ip: string; environment: Asset["environment"]; owner: string };
type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = { name: "", type: "Server", ip: "", environment: "Production", owner: "" };
// IPv4, optionally with a CIDR suffix, or a hostname
const IP_OR_HOST = /^((\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?|[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+)$/i;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Enter an asset name";
  if (!IP_OR_HOST.test(f.ip.trim())) e.ip = "Enter an IP address, CIDR range or hostname";
  if (f.owner.trim().length < 2) e.owner = "Enter the owning team";
  return e;
}

/** Add a new asset, or edit `asset` when given. Remount (key) per open so the form resets. */
export function AssetDialog({ open, onOpenChange, asset }: { open: boolean; onOpenChange: (v: boolean) => void; asset?: Asset | null }) {
  const [form, setForm] = useState<Form>(() => (asset ? { name: asset.name, type: asset.type, ip: asset.ip, environment: asset.environment, owner: asset.owner } : EMPTY));
  const [errors, setErrors] = useState<Errors>({});
  const [shake, setShake] = useState(0);
  const { loading, run } = useFakeSubmit();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return setShake((n) => n + 1);
    const clean = { ...form, name: form.name.trim(), ip: form.ip.trim(), owner: form.owner.trim() };
    run(() => {
      const { addAsset, updateAsset } = useApp.getState();
      if (asset) {
        updateAsset(asset.id, clean);
        toast.success(`${clean.name} updated`);
      } else {
        addAsset(clean);
        toast.success(`${clean.name} is now monitored`);
      }
      onOpenChange(false);
    });
  };

  return (
    <BdDialog open={open} onOpenChange={onOpenChange} title={asset ? "Edit asset" : "Add asset"} description={asset ? undefined : "Start monitoring a server, database, cloud account, network device or application."}>
      <Shake shakeKey={shake}>
        <form onSubmit={submit} noValidate className="flex flex-col gap-[16px]">
          <Field label="Asset name" htmlFor="asset-name" error={errors.name}>
            <TextInput id="asset-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="prod-api-02" invalid={!!errors.name} autoFocus />
          </Field>
          <div className="grid gap-[16px] sm:grid-cols-2">
            <Field label="Type">
              <SelectField value={form.type} onValueChange={(v) => set("type", v as AssetType)} options={ASSET_TYPES.map((t) => ({ value: t, label: t }))} />
            </Field>
            <Field label="Environment">
              <SelectField value={form.environment} onValueChange={(v) => set("environment", v as Asset["environment"])} options={ENVIRONMENTS.map((t) => ({ value: t, label: t }))} />
            </Field>
          </div>
          <Field label="IP / hostname" htmlFor="asset-ip" error={errors.ip}>
            <TextInput id="asset-ip" value={form.ip} onChange={(e) => set("ip", e.target.value)} placeholder="10.0.1.24" invalid={!!errors.ip} />
          </Field>
          <Field label="Owner" htmlFor="asset-owner" error={errors.owner}>
            <TextInput id="asset-owner" value={form.owner} onChange={(e) => set("owner", e.target.value)} placeholder="Platform team" invalid={!!errors.owner} />
          </Field>
          <div className="mt-[6px] flex justify-end gap-[10px]">
            <button type="button" className={outlineBtn} onClick={() => onOpenChange(false)}>
              Cancel
            </button>
            <button type="submit" className={primaryBtn} disabled={loading}>
              {loading && <Spinner />}
              {asset ? "Save changes" : "Add asset"}
            </button>
          </div>
        </form>
      </Shake>
    </BdDialog>
  );
}
