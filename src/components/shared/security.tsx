"use client";

/**
 * Security-dashboard UI kit: severity/status badges, KPI tiles, score ring, risk bar, filter tabs,
 * search box, empty state and table class names. Every dashboard page builds from these.
 */
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, type LucideIcon } from "lucide-react";
import { CountUp } from "@/components/shared/motion";
import { Panel } from "@/components/shared/section";
import type { AlertStatus, AssetStatus, DeviceStatus, IncidentStatus, Severity, VulnStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ---------- tones ---------- */

export type Tone = "red" | "accent" | "orange" | "yellow" | "green" | "teal" | "muted";

const TONE: Record<Tone, { text: string; bg: string; dot: string }> = {
  red: { text: "text-bd-red", bg: "bg-bd-tint-red", dot: "bg-bd-red" },
  accent: { text: "text-bd-royal", bg: "bg-bd-tint-royal", dot: "bg-bd-royal" },
  orange: { text: "text-[#d17a3f]", bg: "bg-[rgb(255_138_61/0.14)]", dot: "bg-[#d17a3f]" },
  yellow: { text: "text-bd-orange", bg: "bg-bd-tint-yellow", dot: "bg-bd-orange" },
  green: { text: "text-bd-green", bg: "bg-[rgb(65_212_168/0.14)]", dot: "bg-bd-green" },
  teal: { text: "text-bd-teal", bg: "bg-bd-tint-teal", dot: "bg-bd-teal" },
  muted: { text: "text-bd-muted", bg: "bg-bd-input", dot: "bg-bd-muted" },
};
export const toneText = (t: Tone) => TONE[t].text;
export const toneBg = (t: Tone) => TONE[t].bg;

export const SEVERITY_TONE: Record<Severity, Tone> = { Critical: "red", High: "orange", Medium: "yellow", Low: "teal" };
/** Hex colours per severity for charts (recharts needs real colours). */
export const SEVERITY_COLOR: Record<Severity, string> = { Critical: "#d14b4b", High: "#d17a3f", Medium: "#c9a03c", Low: "#3a9e94" };

export const STATUS_TONE: Record<AlertStatus | IncidentStatus | VulnStatus | DeviceStatus | AssetStatus, Tone> = {
  Open: "red",
  Investigating: "yellow",
  Resolved: "green",
  Contained: "yellow",
  "In progress": "yellow",
  Patched: "green",
  Healthy: "green",
  "At risk": "red",
  Isolated: "muted",
  Protected: "green",
  Offline: "muted",
};

/* ---------- badges ---------- */

/** Small rounded pill with a status dot. */
export function Pill({ tone, children, className, pulse }: { tone: Tone; children: React.ReactNode; className?: string; pulse?: boolean }) {
  const t = TONE[tone];
  return (
    <span className={cn("inline-flex items-center gap-[6px] rounded-[6px] px-[8px] py-[3px] text-[12px] leading-[1.4] font-medium whitespace-nowrap xl:text-[13px]", t.bg, t.text, className)}>
      <span className="relative flex size-[6px]">
        {pulse && <span className={cn("absolute inset-0 animate-ping rounded-full opacity-75", t.dot)} />}
        <span className={cn("relative size-[6px] rounded-full", t.dot)} />
      </span>
      {children}
    </span>
  );
}

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <Pill tone={SEVERITY_TONE[severity]} pulse={severity === "Critical"} className={className}>
      {severity}
    </Pill>
  );
}

export function StatusBadge({ status, className }: { status: keyof typeof STATUS_TONE; className?: string }) {
  return (
    <Pill tone={STATUS_TONE[status]} className={className}>
      {status}
    </Pill>
  );
}

/* ---------- KPI tile ---------- */

export function StatTile({
  icon: Icon,
  label,
  value,
  suffix,
  hint,
  tone = "accent",
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  hint?: React.ReactNode;
  tone?: Tone;
  href?: string;
}) {
  const body = (
    <Panel className="flex h-full items-center gap-[14px] p-[18px] xl:gap-[18px] xl:p-[22px]">
      <span className={cn("flex size-[46px] shrink-0 items-center justify-center rounded-[8px] xl:size-[54px]", TONE[tone].bg, TONE[tone].text)}>
        <Icon className="size-[22px] xl:size-[26px]" strokeWidth={1.6} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] text-bd-muted xl:text-[14px]">{label}</span>
        <span className="mt-[2px] block text-[24px] leading-tight font-medium text-bd-primary xl:text-[28px]">
          <CountUp value={value} suffix={suffix} />
        </span>
        {hint && <span className="mt-[2px] block truncate text-[12px] text-bd-muted xl:text-[13px]">{hint}</span>}
      </span>
    </Panel>
  );
  return href ? (
    <Link href={href} className="block h-full rounded-[8px] outline-none focus-visible:ring-[3px] focus-visible:ring-bd-royal/30">
      {body}
    </Link>
  ) : (
    body
  );
}

/* ---------- score ring & risk bar ---------- */

export const scoreTone = (n: number): Tone => (n >= 85 ? "green" : n >= 70 ? "teal" : n >= 50 ? "yellow" : "red");
const RING_COLOR: Record<Tone, string> = { green: "#3d9e7c", teal: "#3a9e94", yellow: "#c9a03c", red: "#d14b4b", orange: "#d17a3f", accent: "#e12632", muted: "#9c9c9c" };

/** Animated circular gauge, 0–100. */
export function ScoreRing({ value, size = 160, stroke = 10, children }: { value: number; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = RING_COLOR[scoreTone(value)];
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-bd-input)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

/** Thin 0–100 bar; colour follows risk (higher = redder). */
export function RiskBar({ value, className }: { value: number; className?: string }) {
  const color = value >= 70 ? "bg-bd-red" : value >= 40 ? "bg-bd-orange" : "bg-bd-green";
  return (
    <span className={cn("flex items-center gap-[8px]", className)}>
      <span className="h-[6px] w-full min-w-[60px] overflow-hidden rounded-full bg-bd-input">
        <motion.span className={cn("block h-full rounded-full", color)} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
      </span>
      <span className="w-[28px] shrink-0 text-right text-[12px] text-bd-muted tabular-nums xl:text-[13px]">{value}</span>
    </span>
  );
}

/* ---------- toolbar pieces ---------- */

/** Underlined tab row (All / Open / Resolved …). Pass a unique layoutId per page. */
export function FilterTabs<T extends string>({
  tabs,
  value,
  onChange,
  layoutId,
  counts,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (v: T) => void;
  layoutId: string;
  counts?: Partial<Record<T, number>>;
}) {
  return (
    <div role="tablist" className="no-scrollbar flex gap-[22px] overflow-x-auto border-b border-bd-border xl:gap-[32px]">
      {tabs.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t)}
            className={cn("relative shrink-0 pb-[10px] text-[13px] font-medium whitespace-nowrap transition-colors xl:text-[15px]", active ? "text-bd-royal" : "text-bd-muted hover:text-bd-primary")}
          >
            {t}
            {counts?.[t] !== undefined && <span className="ml-[6px] text-[11px] text-bd-muted xl:text-[12px]">{counts[t]}</span>}
            {active && <motion.span layoutId={layoutId} className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-bd-royal" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          </button>
        );
      })}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search…", className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={cn("flex h-[40px] items-center gap-[10px] rounded-[8px] border border-bd-card-border bg-bd-page px-[12px] transition-colors focus-within:border-bd-royal", className)}>
      <Search className="size-[16px] shrink-0 text-bd-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-bd-primary outline-none placeholder:text-bd-placeholder xl:text-[14px]"
      />
    </label>
  );
}

export function EmptyState({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] px-[20px] py-[48px] text-center">
      <span className="flex size-[52px] items-center justify-center rounded-full border border-bd-border text-bd-royal">
        <Icon className="size-[22px]" strokeWidth={1.6} />
      </span>
      <p className="text-[15px] font-medium text-bd-primary">{title}</p>
      {children && <p className="max-w-[340px] text-[13px] leading-[1.5] text-bd-muted">{children}</p>}
    </div>
  );
}

/* ---------- tables ---------- */

/** Class names for data tables inside a <Panel>: wrap the <table> in <div className={tableWrap}>. */
export const tableWrap = "overflow-x-auto";
export const tableCls = "w-full min-w-[720px] border-collapse text-left";
export const thCls = "px-[16px] py-[12px] text-[12px] font-medium tracking-wide whitespace-nowrap text-bd-muted uppercase xl:px-[20px] xl:text-[13px]";
export const trCls = "border-t border-bd-border transition-colors hover:bg-bd-icon-light";
export const tdCls = "px-[16px] py-[14px] text-[13px] text-bd-text xl:px-[20px] xl:text-[14px]";
