"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Radar } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/shared/section";
import { SelectField } from "@/components/shared/form-controls";
import { primaryBtn } from "@/components/shared/dialog-kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const STEPS = ["Discovering open ports", "Checking installed packages", "Matching CVE database", "Reviewing configuration"];

/** Pick an asset and run a (simulated) vulnerability scan; updates the asset's last-scan time when done. */
export function QuickScan() {
  const assets = useApp((s) => s.assets);
  const [assetId, setAssetId] = useState(assets[0]?.id ?? "");
  const [step, setStep] = useState(-1); // -1 idle, 0..n running, n = done
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  const asset = assets.find((a) => a.id === assetId);
  const running = step >= 0 && step < STEPS.length;
  const done = step === STEPS.length;

  const start = () => {
    if (!asset || running) return;
    // count in a local, not inside a setState updater: updaters must be pure (they can run during render, twice in dev)
    let current = 0;
    setStep(0);
    timer.current = setInterval(() => {
      current += 1;
      setStep(current);
      if (current < STEPS.length) return;
      clearInterval(timer.current);
      const { updateAsset, notify } = useApp.getState();
      updateAsset(asset.id, { lastScan: new Date().toISOString() });
      notify({ title: "Scan complete", body: `${asset.name}: no new vulnerabilities found`, kind: "info", href: "/dashboard/assets" });
      toast.success(`Scan of ${asset.name} complete`);
    }, 900);
  };

  return (
    <Panel hover={false} className="flex h-full flex-col gap-[16px] p-[18px] xl:p-[24px]">
      <div className="flex items-center gap-[12px]">
        <span className="relative flex size-[44px] items-center justify-center rounded-[8px] bg-bd-tint-royal text-bd-royal">
          <Radar className={cn("size-[22px]", running && "animate-spin [animation-duration:2.4s]")} strokeWidth={1.6} />
        </span>
        <p className="text-[13px] leading-[1.5] text-bd-muted">Run an on-demand vulnerability scan against any monitored asset.</p>
      </div>
      <SelectField value={assetId} onValueChange={(v) => (setAssetId(v), setStep(-1))} options={assets.map((a) => ({ value: a.id, label: `${a.name} · ${a.type}` }))} placeholder="Choose an asset" />

      <AnimatePresence initial={false}>
        {step >= 0 && (
          <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-[8px] overflow-hidden">
            {STEPS.map((label, i) => (
              <li key={label} className={cn("flex items-center gap-[8px] text-[12px] transition-colors xl:text-[13px]", i < step || done ? "text-bd-green" : i === step ? "text-bd-primary" : "text-bd-placeholder")}>
                {i < step || done ? <CheckCircle2 className="size-[14px]" /> : <span className={cn("size-[14px] rounded-full border", i === step ? "animate-pulse border-bd-royal" : "border-bd-card-border")} />}
                {label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <button type="button" onClick={start} disabled={!asset || running} className={cn(primaryBtn, "mt-auto w-full")}>
        {running ? `Scanning… ${Math.round((step / STEPS.length) * 100)}%` : done ? "Scan again" : "Start scan"}
      </button>
    </Panel>
  );
}
