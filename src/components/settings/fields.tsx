"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TextInput, fieldLabel } from "@/components/shared/form-controls";
import { cn } from "@/lib/utils";

/** Settings group heading + optional one-line description. */
export function SubHeading({ children, description, className }: { children: React.ReactNode; description?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[4px]", className)}>
      <h3 className="text-[14px] leading-[1.3] text-bd-primary xl:text-[15px]">{children}</h3>
      {description && <p className="text-[12px] leading-[1.5] text-bd-muted xl:text-[13px]">{description}</p>}
    </div>
  );
}

/** Label + controlled shadcn Input (password fields get a show/hide toggle). */
export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  className,
  error,
  name,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  error?: string;
  name?: string;
}) {
  const id = useId();
  const [reveal, setReveal] = useState(false);
  const isPwd = type === "password";
  return (
    <motion.div
      animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("flex min-w-0 flex-col gap-[8px] xl:gap-[10px]", className)}
    >
      <Label htmlFor={id} className={fieldLabel}>
        {label}
      </Label>
      <div className="relative">
        <TextInput
          id={id}
          name={name}
          type={isPwd && reveal ? "text" : type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          className={cn(isPwd && "pr-[44px]")}
        />
        {isPwd && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? `Hide ${label}` : `Show ${label}`}
            className="absolute inset-y-0 right-0 flex w-[44px] items-center justify-center text-bd-muted transition-colors hover:text-bd-royal"
          >
            {reveal ? <EyeOff className="size-[16px]" /> : <Eye className="size-[16px]" />}
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} role="alert" className="text-[12px] text-bd-red xl:text-[13px]">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Label wrapper for shadcn-based controls (SelectField). */
export function ControlField({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-[8px] xl:gap-[10px]">
      <Label htmlFor={htmlFor} className={fieldLabel}>
        {label}
      </Label>
      {children}
      {hint && <p className="text-[12px] text-bd-muted">{hint}</p>}
    </div>
  );
}

/** Switch row: label + description on the left, accent switch on the right. */
export function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-[16px] rounded-[8px] border border-bd-border px-[14px] py-[12px] xl:px-[16px]">
      <label htmlFor={id} className="min-w-0 cursor-pointer select-none">
        <span className="block text-[13px] text-bd-primary xl:text-[14px]">{label}</span>
        {description && <span className="mt-[2px] block text-[12px] leading-[1.5] text-bd-muted">{description}</span>}
      </label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0 cursor-pointer data-[state=checked]:bg-bd-royal data-[state=unchecked]:bg-bd-card-border focus-visible:ring-bd-royal/30"
      />
    </div>
  );
}

/** Save button: white → accent like the site CTA, with a short "saving → saved ✓" state. */
/** `onValidate` runs first; returning false aborts (show inline errors there). */
export function SaveButton({ onSave, onValidate, label = "Save changes" }: { onSave?: () => void; onValidate?: () => boolean; label?: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const click = () => {
    if (state !== "idle") return;
    if (onValidate && !onValidate()) return;
    setState("saving");
    timers.current.push(
      window.setTimeout(() => {
        onSave?.();
        setState("saved");
      }, 650),
      window.setTimeout(() => setState("idle"), 2300),
    );
  };

  return (
    <div className="flex justify-end">
      <motion.button
        type="submit"
        disabled={state === "saving"}
        aria-busy={state === "saving"}
        onClick={(e) => {
          e.preventDefault();
          click();
        }}
        whileTap={{ scale: 0.97 }}
        aria-live="polite"
        className={cn(
          "group relative flex h-[42px] w-full items-center justify-center overflow-hidden rounded-[8px] text-[14px] font-medium transition-colors sm:w-[180px] xl:h-[46px] xl:text-[15px]",
          state === "saved" ? "bg-bd-green text-white" : "bg-white text-bd-page",
        )}
      >
        {state === "idle" && (
          <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-bd-royal transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100" />
        )}
        <AnimatePresence mode="popLayout" initial={false}>
          {state === "idle" && (
            <motion.span key="idle" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="relative transition-colors duration-300 group-hover:text-white">
              {label}
            </motion.span>
          )}
          {state === "saving" && (
            <motion.span key="saving" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="flex items-center">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="block size-[18px] rounded-full border-2 border-bd-page/30 border-t-bd-page"
              />
            </motion.span>
          )}
          {state === "saved" && (
            <motion.span key="saved" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="flex items-center gap-[6px]">
              <Check className="size-[18px]" strokeWidth={2.4} />
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

/** 4-bar password strength meter (0–4). */
export function passwordScore(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

const STRENGTH = [
  { label: "Too weak", bar: "bg-bd-red", text: "text-bd-red" },
  { label: "Weak", bar: "bg-bd-red", text: "text-bd-red" },
  { label: "Fair", bar: "bg-bd-orange", text: "text-bd-orange" },
  { label: "Good", bar: "bg-bd-teal", text: "text-bd-teal" },
  { label: "Strong", bar: "bg-bd-green", text: "text-bd-green" },
];

export function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;
  const score = passwordScore(value);
  const s = STRENGTH[score];
  return (
    <div className="flex items-center gap-[10px]">
      <div className="flex flex-1 gap-[6px]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[5px] flex-1 overflow-hidden rounded-full bg-bd-input">
            <motion.div className={cn("h-full rounded-full", s.bar)} initial={false} animate={{ width: i < score ? "100%" : "0%" }} transition={{ duration: 0.3, delay: i * 0.04 }} />
          </div>
        ))}
      </div>
      <span className={cn("w-[64px] text-right text-[12px] font-medium", s.text)}>{s.label}</span>
    </div>
  );
}
