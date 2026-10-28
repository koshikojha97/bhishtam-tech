"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { setSession, useApp } from "@/lib/store";
import { CheckboxField } from "@/components/shared/form-controls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AuthField,
  Divider,
  FieldError,
  GoogleButton,
  PasswordStrength,
  SubmitButton,
  isEmail,
  passwordScore,
  type SubmitState,
} from "./fields";
import { listContainer, listItem } from "@/components/shared/motion";

const LEGAL = {
  terms: {
    title: "Terms of Service",
    body: [
      "These placeholder terms describe how you may use the Bhishtam Tech demo. By creating an account you agree to use the service lawfully and to keep your credentials confidential.",
      "Bhishtam Tech is provided “as is” for demonstration purposes. Alerts, incidents, assets and devices shown in the dashboard are sample data.",
      "We may update these terms from time to time. Continued use after changes means you accept the revised terms.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "This demo stores your profile, preferences and activity only in your browser’s local storage. Nothing is sent to a server.",
      "A session cookie keeps you signed in. Signing out or clearing site data removes it.",
      "Replace this placeholder with your organisation’s privacy policy before going live.",
    ],
  },
} as const;

type Errors = Partial<
  Record<"name" | "email" | "password" | "confirm" | "terms", string>
>;

export function SignupForm() {
  const router = useRouter();
  const updateUser = useApp((s) => s.updateUser);
  const notify = useApp((s) => s.notify);
  const [legal, setLegal] = useState<keyof typeof LEGAL | null>(null);
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const set = (k: keyof typeof f) => (v: string) => {
    setF((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n: Errors = {};
    if (f.name.trim().length < 2) n.name = "Enter your full name";
    if (!isEmail(f.email)) n.email = "Enter a valid email address";
    if (passwordScore(f.password) < 2 || f.password.length < 8)
      n.password = "Use 8+ characters with a mix of letters and numbers";
    if (f.confirm !== f.password || !f.confirm)
      n.confirm = "Passwords do not match";
    if (!terms) n.terms = "Please accept the terms to continue";
    setErrors(n);
    if (Object.keys(n).length) return;
    setState("loading");
    // TODO: replace with your registration API call
    setTimeout(() => {
      const name = f.name.trim();
      const email = f.email.trim();
      updateUser({ name, email, username: name });
      setSession(email, true);
      notify({
        title: "Welcome to Bhishtam Tech",
        body: `Your account for ${email} is ready`,
        kind: "info",
        href: "/dashboard/settings",
      });
      toast.success("Account created — welcome to Bhishtam Tech!");
      setState("success");
      setTimeout(() => router.replace("/dashboard"), 600);
    }, 1000);
  };

  return (
    <motion.form
      variants={listContainer}
      initial="hidden"
      animate="show"
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-[16px] xl:gap-[20px]"
    >
      <motion.div variants={listItem}>
        <AuthField
          label="Full Name"
          autoComplete="name"
          placeholder="Charlene Reed"
          value={f.name}
          onChange={set("name")}
          error={errors.name}
        />
      </motion.div>
      <motion.div variants={listItem}>
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="charlenereed@gmail.com"
          value={f.email}
          onChange={set("email")}
          error={errors.email}
        />
      </motion.div>
      <motion.div variants={listItem} className="flex flex-col gap-[10px]">
        <AuthField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="**********"
          value={f.password}
          onChange={set("password")}
          error={errors.password}
        />
        <PasswordStrength value={f.password} />
      </motion.div>
      <motion.div variants={listItem}>
        <AuthField
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="**********"
          value={f.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
        />
      </motion.div>
      <motion.div variants={listItem} className="flex flex-col gap-[6px]">
        <CheckboxField
          checked={terms}
          onCheckedChange={(v) => {
            setTerms(v);
            if (v) setErrors((e) => ({ ...e, terms: undefined }));
          }}
        >
          <span>
            I agree to the{" "}
            <button
              type="button"
              onClick={(e) => (e.preventDefault(), setLegal("terms"))}
              className="cursor-pointer font-medium text-bd-blue hover:underline"
            >
              Terms
            </button>{" "}
            &amp;{" "}
            <button
              type="button"
              onClick={(e) => (e.preventDefault(), setLegal("privacy"))}
              className="cursor-pointer font-medium text-bd-blue hover:underline"
            >
              Privacy Policy
            </button>
          </span>
        </CheckboxField>
        <FieldError message={errors.terms} />
      </motion.div>
      <motion.div variants={listItem} className="mt-[4px]">
        <SubmitButton state={state}>Create Account</SubmitButton>
      </motion.div>
      <motion.div variants={listItem}>
        <Divider>or</Divider>
      </motion.div>
      <motion.div variants={listItem}>
        <GoogleButton label="Sign up with Google" />
      </motion.div>
      <motion.p
        variants={listItem}
        className="text-center text-[13px] text-bd-muted xl:text-[15px]"
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-bd-blue hover:underline"
        >
          Sign In
        </Link>
      </motion.p>

      <Dialog open={legal !== null} onOpenChange={(o) => !o && setLegal(null)}>
        <DialogContent className="site-root max-h-[85dvh] overflow-y-auto rounded-[8px] border border-cx-line bg-bd-surface p-[24px] font-geist sm:max-w-[520px] xl:p-[30px]">
          {legal && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-[16px]"
            >
              <DialogHeader>
                <DialogTitle className="text-[22px] font-semibold text-bd-primary">
                  {LEGAL[legal].title}
                </DialogTitle>
                <DialogDescription className="text-[13px] text-bd-muted">
                  Placeholder text for the Bhishtam Tech demo.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-[12px] text-[14px] leading-[1.6] text-bd-text">
                {LEGAL[legal].body.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
              <DialogFooter>
                <button
                  type="button"
                  onClick={() => {
                    setTerms(true);
                    setErrors((e) => ({ ...e, terms: undefined }));
                    setLegal(null);
                  }}
                  className="h-[45px] cursor-pointer rounded-[8px] bg-bd-royal px-[24px] text-[15px] font-medium text-white transition-[filter] hover:brightness-110"
                >
                  I Agree
                </button>
              </DialogFooter>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.form>
  );
}
