"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { setSession } from "@/lib/store";
import { CheckboxField } from "@/components/shared/form-controls";
import { AuthField, Divider, GoogleButton, SubmitButton, isEmail, type SubmitState } from "./fields";
import { listContainer, listItem } from "@/components/shared/motion";

/** Only allow same-origin relative redirects. */
const safeNext = (v: string | null) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/dashboard");

export function LoginForm() {
  return (
    <Suspense fallback={<LoginFormInner next="/dashboard" />}>
      <LoginFormWithParams />
    </Suspense>
  );
}

function LoginFormWithParams() {
  const params = useSearchParams();
  return <LoginFormInner next={safeNext(params.get("next"))} />;
}

function LoginFormInner({ next: nextUrl }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [state, setState] = useState<SubmitState>("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!isEmail(email)) next.email = "Enter a valid email address";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("loading");
    // Demo auth: any valid email + 6+ char password. TODO: replace with your auth API call.
    setTimeout(() => {
      setSession(email.trim(), remember);
      setState("success");
      toast.success("Signed in");
      setTimeout(() => router.replace(nextUrl), 500);
    }, 900);
  };

  return (
    <motion.form variants={listContainer} initial="hidden" animate="show" onSubmit={submit} noValidate className="flex flex-col gap-[18px] xl:gap-[22px]">
      <motion.div variants={listItem}>
        <AuthField label="Email" type="email" autoComplete="email" placeholder="charlenereed@gmail.com" value={email} onChange={(v) => (setEmail(v), setErrors((e) => ({ ...e, email: undefined })))} error={errors.email} />
      </motion.div>
      <motion.div variants={listItem}>
        <AuthField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="**********"
          value={password}
          onChange={(v) => (setPassword(v), setErrors((e) => ({ ...e, password: undefined })))}
          error={errors.password}
        />
      </motion.div>
      <motion.div variants={listItem} className="flex items-center justify-between">
        <CheckboxField checked={remember} onCheckedChange={setRemember}>
          Remember me
        </CheckboxField>
        <Link href="/forgot-password" className="text-[13px] font-medium text-bd-blue hover:underline xl:text-[15px]">
          Forgot password?
        </Link>
      </motion.div>
      <motion.div variants={listItem} className="mt-[6px] flex flex-col gap-[10px]">
        <SubmitButton state={state}>Sign In</SubmitButton>
        <p className="text-center text-[12px] text-bd-muted xl:text-[13px]">Demo: any email + 6+ char password</p>
      </motion.div>
      <motion.div variants={listItem}>
        <Divider>or continue with</Divider>
      </motion.div>
      <motion.div variants={listItem}>
        <GoogleButton label="Sign in with Google" />
      </motion.div>
      <motion.p variants={listItem} className="text-center text-[13px] text-bd-muted xl:text-[15px]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-bd-blue hover:underline">
          Sign Up
        </Link>
      </motion.p>
    </motion.form>
  );
}
