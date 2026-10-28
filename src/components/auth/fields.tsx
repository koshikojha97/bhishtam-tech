"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

/* Marketing-site field styling (app palette tokens from globals.css; radius 8 like the site). */
const labelCls = "text-[13px] leading-[1.21] text-bd-text xl:text-[16px]";
const boxCls =
  "h-[48px] w-full rounded-[8px] border bg-bd-page px-[16px] text-[14px] text-bd-primary outline-none transition-[border-color,box-shadow] placeholder:text-bd-placeholder xl:h-[52px] xl:px-[18px] xl:text-[15px]";

export function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          className="text-[12px] text-bd-red xl:text-[13px]"
          role="alert"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function AuthField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  error,
  right,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  right?: React.ReactNode;
}) {
  const id = useId();
  const [reveal, setReveal] = useState(false);
  const isPwd = type === "password";
  return (
    <motion.div
      animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-[9px] xl:gap-[11px]"
    >
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className={cn(labelCls, "font-normal")}>
          {label}
        </Label>
        {right}
      </div>
      <div className="relative">
        <Input
          id={id}
          type={isPwd && reveal ? "text" : type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            boxCls,
            "shadow-none md:text-[14px] xl:md:text-[15px]",
            isPwd && "pr-[48px]",
            error
              ? "border-bd-red focus-visible:ring-[3px] focus-visible:ring-bd-red/15"
              : "border-bd-card-border hover:border-bd-placeholder focus-visible:border-bd-royal focus-visible:ring-[3px] focus-visible:ring-bd-royal/15",
          )}
        />
        {isPwd && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-[48px] items-center justify-center text-bd-muted transition-colors hover:text-bd-royal"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(reveal)} initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }}>
                {reveal ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </motion.span>
            </AnimatePresence>
          </button>
        )}
      </div>
      <FieldError message={error} />
    </motion.div>
  );
}

export type SubmitState = "idle" | "loading" | "success";

export function SubmitButton({ state, children }: { state: SubmitState; children: React.ReactNode }) {
  return (
    <motion.button
      type="submit"
      disabled={state !== "idle"}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex h-[48px] w-full items-center justify-center overflow-hidden rounded-[8px] text-[16px] font-medium transition-colors xl:h-[52px] xl:text-[18px]",
        state === "success" ? "bg-bd-green text-white" : "bg-white text-cx-bg",
      )}
    >
      {state === "idle" && (
        <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-bd-royal transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100" />
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          className="relative flex items-center gap-[8px] transition-colors duration-300 group-hover:text-white"
        >
          {state === "loading" && <Loader2 className="size-[18px] animate-spin" />}
          {state === "success" && <Check className="size-[18px]" strokeWidth={3} />}
          {state === "loading" ? "Please wait…" : state === "success" ? "Done" : children}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[12px] text-[13px] text-bd-muted xl:text-[14px]">
      <span className="h-px flex-1 bg-bd-card-border" />
      {children}
      <span className="h-px flex-1 bg-bd-card-border" />
    </div>
  );
}

export function GoogleButton({ label }: { label: string }) {
  return (
    <motion.button
      type="button"
      onClick={() => toast.info("Google sign-in isn't configured in this demo")}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[8px] border border-bd-card-border bg-bd-page text-[14px] font-medium text-bd-primary transition-colors hover:border-bd-placeholder xl:h-[52px] xl:text-[16px]"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      {label}
    </motion.button>
  );
}

/** One-time-code input: shadcn InputOTP (auto-advance + paste handled by input-otp). */
export function OtpInput({ length = 6, value, onChange, error }: { length?: number; value: string; onChange: (v: string) => void; error?: boolean }) {
  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={onChange}
      pattern={REGEXP_ONLY_DIGITS}
      inputMode="numeric"
      autoComplete="one-time-code"
      aria-label="Verification code"
      containerClassName="w-full"
    >
      <InputOTPGroup className="flex w-full justify-between gap-[8px]">
        {Array.from({ length }).map((_, i) => (
          <motion.div key={i} className="min-w-0 flex-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <InputOTPSlot
              index={i}
              aria-invalid={error || undefined}
              className={cn(
                "h-[48px] w-full rounded-[8px]! border! bg-bd-page text-[18px] font-semibold text-bd-primary shadow-none xl:h-[56px] xl:text-[22px]",
                error
                  ? "border-bd-red!"
                  : "border-bd-card-border! data-[active=true]:border-bd-royal! data-[active=true]:ring-[3px] data-[active=true]:ring-bd-royal/15",
              )}
            />
          </motion.div>
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export function passwordScore(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s; // 0..4
}

export function PasswordStrength({ value }: { value: string }) {
  const score = passwordScore(value);
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["#d14b4b", "#d14b4b", "#c9a03c", "#3a9e94", "#3d9e7c"];
  if (!value) return null;
  return (
    <div className="flex items-center gap-[10px]">
      <div className="flex flex-1 gap-[6px]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[5px] flex-1 overflow-hidden rounded-full bg-bd-input">
            <motion.div
              className="h-full rounded-full"
              initial={false}
              animate={{ width: i < score ? "100%" : "0%", backgroundColor: colors[score] }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            />
          </div>
        ))}
      </div>
      <span className="w-[62px] text-right text-[12px] font-medium" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
}
