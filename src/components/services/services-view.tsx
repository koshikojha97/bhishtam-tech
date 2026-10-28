"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Check, CreditCard, Layers, Timer } from "lucide-react";
import { toast } from "sonner";
import { Stagger } from "@/components/shared/motion";
import { Panel, Section } from "@/components/shared/section";
import { Pill, StatTile } from "@/components/shared/security";
import { BdDialog, ConfirmDialog, DetailRows, outlineBtn, primaryBtn } from "@/components/shared/dialog-kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SERVICES, usd, type ServiceInfo } from "./service-data";

/** First Monday of next month — sample date for the next scheduled pentest. */
function nextPentest() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return { label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), days: Math.ceil((+d - Date.now()) / 86_400_000) };
}

export function ServicesView() {
  const active = useApp((s) => s.services);
  const [subscribe, setSubscribe] = useState<ServiceInfo | null>(null);
  const [cancel, setCancel] = useState<ServiceInfo | null>(null);

  const spend = SERVICES.filter((s) => active.includes(s.id)).reduce((n, s) => n + s.price, 0);
  const pentestActive = active.includes("pentest");
  const pentest = nextPentest();

  const toggle = (svc: ServiceInfo, on: boolean) => {
    const { toggleService, notify } = useApp.getState();
    toggleService(svc.id);
    notify({
      title: on ? "Service activated" : "Service cancelled",
      body: on ? `${svc.title} is now active` : `${svc.title} will stop at the end of the billing period`,
      kind: "info",
      href: "/dashboard/services",
    });
    toast.success(on ? `${svc.title} activated` : `${svc.title} cancelled`);
  };

  return (
    <Stagger className="flex flex-col gap-[22px] xl:gap-[26px]">
      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4 xl:gap-[22px]">
        <StatTile icon={Layers} tone="accent" label="Active services" value={active.length} suffix={`/${SERVICES.length}`} hint="Managed by Bhishtam Tech" />
        <StatTile icon={CreditCard} tone="green" label="Monthly spend" value={spend} suffix=" USD" hint="Billed on the 1st" />
        <StatTile
          icon={CalendarClock}
          tone="yellow"
          label="Next pentest in"
          value={pentestActive ? pentest.days : 0}
          suffix=" days"
          hint={pentestActive ? `Starts ${pentest.label}` : "Subscribe to schedule one"}
        />
        <StatTile icon={Timer} tone="teal" label="SOC response SLA" value={15} suffix=" min" hint="Critical alerts, 24/7" />
      </div>

      <Section title="Service Catalogue">
        <div className="grid gap-[16px] md:grid-cols-2 xl:grid-cols-3 xl:gap-[22px]">
          {SERVICES.map((svc) => (
            <ServiceCard key={svc.id} svc={svc} active={active.includes(svc.id)} onSubscribe={() => setSubscribe(svc)} onManage={() => setCancel(svc)} />
          ))}
        </div>
      </Section>

      <BdDialog open={!!subscribe} onOpenChange={(o) => !o && setSubscribe(null)} title={subscribe ? `Activate ${subscribe.title}` : "Activate service"} description={subscribe?.description}>
        {subscribe && (
          <div className="flex flex-col gap-[18px]">
            <DetailRows
              rows={[
                ["Monthly price", `${usd(subscribe.price)} / month`],
                ["Service level", subscribe.sla],
                ["Billing", "Prorated, cancel any time"],
              ]}
            />
            <div className="flex justify-end gap-[10px]">
              <button type="button" className={outlineBtn} onClick={() => setSubscribe(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={primaryBtn}
                onClick={() => {
                  toggle(subscribe, true);
                  setSubscribe(null);
                }}
              >
                Activate service
              </button>
            </div>
          </div>
        )}
      </BdDialog>

      <ConfirmDialog
        open={!!cancel}
        onOpenChange={(o) => !o && setCancel(null)}
        title={cancel ? `Cancel ${cancel.title}?` : "Cancel service?"}
        description="Coverage continues until the end of the current billing period. You can re-activate it at any time."
        confirmLabel="Cancel service"
        destructive
        onConfirm={() => cancel && toggle(cancel, false)}
      />
    </Stagger>
  );
}

function ServiceCard({ svc, active, onSubscribe, onManage }: { svc: ServiceInfo; active: boolean; onSubscribe: () => void; onManage: () => void }) {
  const Icon = svc.icon;
  return (
    <Panel className={cn("relative flex h-full flex-col gap-[16px] overflow-hidden p-[20px] xl:p-[24px]", active && "border-bd-royal/50 hover:border-bd-royal/70")}>
      {active && <span aria-hidden className="pointer-events-none absolute -top-[60px] -right-[60px] size-[160px] rounded-full bg-[radial-gradient(closest-side,rgb(225_38_50/0.22),transparent)]" />}
      <div className="relative flex items-start justify-between gap-[12px]">
        <motion.span whileHover={{ rotate: -6, scale: 1.05 }} className={cn("flex size-[48px] items-center justify-center rounded-[8px]", active ? "bg-bd-tint-royal text-bd-royal" : "bg-bd-input text-bd-muted")}>
          <Icon className="size-[24px]" strokeWidth={1.6} />
        </motion.span>
        {active ? <Pill tone="green">Active</Pill> : <Pill tone="muted">Available</Pill>}
      </div>
      <div className="relative">
        <p className="text-[12px] text-bd-royal xl:text-[13px]">
          {"// "}
          {svc.tagline}
        </p>
        <h3 className="mt-[6px] text-[16px] leading-[1.3] text-bd-primary xl:text-[17px]">{svc.title}</h3>
        <p className="mt-[8px] text-[13px] leading-[1.55] text-bd-muted xl:text-[14px]">{svc.description}</p>
      </div>
      <ul className="relative flex flex-col gap-[8px]">
        {svc.features.map((f) => (
          <li key={f} className="flex items-start gap-[8px] text-[13px] text-bd-text">
            <Check className="mt-[2px] size-[14px] shrink-0 text-bd-royal" />
            {f}
          </li>
        ))}
      </ul>
      <div className="relative mt-auto flex items-center justify-between gap-[12px] border-t border-bd-border pt-[16px]">
        <p className="text-bd-primary">
          <span className="text-[20px] font-medium xl:text-[22px]">{usd(svc.price)}</span>
          <span className="text-[12px] text-bd-muted"> /mo</span>
        </p>
        {active ? (
          <button type="button" onClick={onManage} className={outlineBtn}>
            Manage
          </button>
        ) : (
          <button type="button" onClick={onSubscribe} className={primaryBtn}>
            Subscribe
          </button>
        )}
      </div>
    </Panel>
  );
}
