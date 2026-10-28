"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import { AuthField, FieldError, OtpInput, PasswordStrength, SubmitButton, isEmail, passwordScore, type SubmitState } from "./fields";

type Step = "email" | "otp" | "reset" | "done";
const STEPS: Step[] = ["email", "otp", "reset", "done"];

const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

function Progress({ step }: { step: Step }) {
  const idx = STEPS.indexOf(step);
  return (
    <div className="mb-[25px] flex gap-[8px]">
      {STEPS.slice(0, 3).map((s, i) => (
        <div key={s} className="h-[5px] flex-1 overflow-hidden rounded-full bg-bd-input">
          <motion.div className="h-full rounded-full bg-bd-royal" initial={false} animate={{ width: i <= idx ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
        </div>
      ))}
    </div>
  );
}

export function ForgotPasswordFlow({ onStepChange }: { onStepChange?: (s: Step) => void }) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState({ password: "", confirm: "" });
  const [error, setError] = useState<string>();
  const [state, setState] = useState<SubmitState>("idle");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => onStepChange?.(step), [step, onStepChange]);
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // TODO: replace the timeouts with your API calls
  const fake = (next: () => void) => {
    setState("loading");
    setTimeout(() => {
      setState("idle");
      next();
    }, 900);
  };

  const go = (s: Step) => {
    setError(undefined);
    setStep(s);
  };

  return (
    <div>
      {step !== "done" && <Progress step={step} />}
      <AnimatePresence mode="wait">
        {step === "email" && (
          <motion.form
            key="email"
            {...slide}
            noValidate
            className="flex flex-col gap-[20px]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isEmail(email)) return setError("Enter a valid email address");
              fake(() => {
                setResendIn(30);
                go("otp");
              });
            }}
          >
            <AuthField label="Email" type="email" autoComplete="email" placeholder="charlenereed@gmail.com" value={email} onChange={(v) => (setEmail(v), setError(undefined))} error={error} />
            <SubmitButton state={state}>Send Reset Code</SubmitButton>
          </motion.form>
        )}

        {step === "otp" && (
          <motion.form
            key="otp"
            {...slide}
            className="flex flex-col gap-[20px]"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.replace(/\s/g, "").length !== 6) return setError("Enter the 6-digit code");
              fake(() => go("reset"));
            }}
          >
            <div className="flex items-center gap-[14px] rounded-[8px] border border-bd-card-border bg-bd-page p-[14px]">
              <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-bd-tint-blue text-bd-royal">
                <MailCheck className="size-[22px]" />
              </span>
              <p className="text-[13px] leading-[1.5] text-bd-muted xl:text-[14px]">
                We sent a 6-digit code to <span className="font-semibold text-bd-primary">{email}</span>
              </p>
            </div>
            <div className="flex flex-col gap-[9px]">
              <span className="text-[13px] text-bd-text xl:text-[16px]">Verification Code</span>
              <OtpInput value={code} onChange={(v) => (setCode(v), setError(undefined))} error={!!error} />
              <FieldError message={error} />
            </div>
            <SubmitButton state={state}>Verify Code</SubmitButton>
            <p className="text-center text-[13px] text-bd-muted xl:text-[14px]">
              Didn&apos;t get it?{" "}
              <button
                type="button"
                disabled={resendIn > 0}
                onClick={() => {
                  setResendIn(30);
                  toast.success(`New code sent to ${email}`);
                }}
                className="font-semibold text-bd-blue disabled:cursor-not-allowed disabled:text-bd-muted"
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
              </button>
            </p>
          </motion.form>
        )}

        {step === "reset" && (
          <motion.form
            key="reset"
            {...slide}
            noValidate
            className="flex flex-col gap-[18px]"
            onSubmit={(e) => {
              e.preventDefault();
              if (pwd.password.length < 8 || passwordScore(pwd.password) < 2) return setError("Use 8+ characters with a mix of letters and numbers");
              if (pwd.password !== pwd.confirm) return setError("Passwords do not match");
              fake(() => go("done"));
            }}
          >
            <div className="flex flex-col gap-[10px]">
              <AuthField label="New Password" type="password" autoComplete="new-password" placeholder="**********" value={pwd.password} onChange={(v) => setPwd((p) => ({ ...p, password: v }))} />
              <PasswordStrength value={pwd.password} />
            </div>
            <AuthField
              label="Confirm New Password"
              type="password"
              autoComplete="new-password"
              placeholder="**********"
              value={pwd.confirm}
              onChange={(v) => setPwd((p) => ({ ...p, confirm: v }))}
              error={error}
            />
            <SubmitButton state={state}>Reset Password</SubmitButton>
          </motion.form>
        )}

        {step === "done" && (
          <motion.div key="done" {...slide} className="flex flex-col items-center text-center">
            <motion.span
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              className="flex size-[80px] items-center justify-center rounded-full bg-bd-tint-teal text-bd-teal"
            >
              <ShieldCheck className="size-[40px]" />
            </motion.span>
            <h3 className="mt-[18px] text-[18px] font-semibold text-bd-primary xl:text-[22px]">Password updated</h3>
            <p className="mt-[6px] text-[13px] text-bd-muted xl:text-[15px]">You can now sign in with your new password.</p>
            <Link
              href="/login"
              className="group relative mt-[25px] flex h-[48px] w-full items-center justify-center overflow-hidden rounded-[8px] bg-white text-[16px] font-medium text-cx-bg xl:h-[52px] xl:text-[18px]"
            >
              <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-bd-royal transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-x-100" />
              <span className="relative transition-colors duration-300 group-hover:text-white">Back to Sign In</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {step !== "done" && (
        <div className="mt-[22px] flex items-center justify-between">
          {step !== "email" ? (
            <button type="button" onClick={() => go(STEPS[STEPS.indexOf(step) - 1])} className="flex items-center gap-[6px] text-[13px] font-medium text-bd-muted hover:text-bd-primary xl:text-[15px]">
              <ArrowLeft className="size-[16px]" /> Back
            </button>
          ) : (
            <span />
          )}
          <Link href="/login" className="text-[13px] font-semibold text-bd-blue hover:underline xl:text-[15px]">
            Back to Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
