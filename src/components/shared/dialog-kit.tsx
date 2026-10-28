"use client";

/**
 * Dashboard dialog building blocks (shadcn Dialog / AlertDialog in the site style:
 * #0c0c0c surface, #212121 border, radius 8, Michroma title) plus button classes and form helpers.
 */
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const btnBase =
  "inline-flex h-[40px] items-center justify-center gap-[8px] whitespace-nowrap rounded-[8px] px-[20px] text-[14px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 xl:h-[44px] xl:text-[15px]";
/** White → accent on hover, like the site's "Get in touch" button. */
export const primaryBtn = cn(btnBase, "bg-white text-black hover:bg-bd-royal hover:text-white"); // text-black, not text-bd-page: tailwind-merge only recognises built-in colours when merging with shadcn defaults
export const outlineBtn = cn(btnBase, "border border-bd-card-border bg-transparent text-bd-primary hover:border-bd-royal hover:text-bd-royal");
export const dangerBtn = cn(btnBase, "bg-bd-red text-white hover:bg-bd-red/85");

const contentCls =
  "max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-[8px] border border-bd-border bg-bd-surface p-[22px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:max-w-[480px] xl:p-[30px]";
const titleCls = "text-left text-[18px] leading-tight text-bd-primary xl:text-[20px]";
const descCls = "text-left text-[13px] leading-[20px] text-bd-muted xl:text-[14px] xl:leading-[22px]";

export function BdDialog({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(contentCls, className)}>
        <DialogHeader className="mb-[18px] gap-[6px]">
          <DialogTitle className={titleCls}>{title}</DialogTitle>
          {description ? <DialogDescription className={descCls}>{description}</DialogDescription> : <DialogDescription className="sr-only">{String(title)}</DialogDescription>}
        </DialogHeader>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="min-w-0">
          {children}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  destructive,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(contentCls, "sm:max-w-[420px]")}>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="grid gap-[20px]">
          <AlertDialogHeader className="gap-[6px] text-left sm:text-left">
            <AlertDialogTitle className={titleCls}>{title}</AlertDialogTitle>
            <AlertDialogDescription className={descCls}>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-[10px]">
            <AlertDialogCancel className={cn(outlineBtn, "mt-0 shadow-none hover:bg-transparent")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} className={destructive ? dangerBtn : primaryBtn}>
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Two-column key/value list used by detail dialogs. */
export function DetailRows({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y divide-bd-border rounded-[8px] border border-bd-border px-[16px]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-4 py-[11px] text-[13px] xl:text-[14px]">
          <dt className="text-bd-muted">{k}</dt>
          <dd className="min-w-0 text-right font-medium break-words text-bd-text">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Spinner() {
  return <Loader2 className="size-[16px] animate-spin" />;
}

/** Wrap a form; re-keying `shakeKey` replays a horizontal shake (invalid submit). */
export function Shake({ shakeKey, className, children }: { shakeKey: number; className?: string; children: React.ReactNode }) {
  const controls = useAnimationControls();
  useEffect(() => {
    if (shakeKey) void controls.start({ x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.45 } });
  }, [shakeKey, controls]);
  return (
    <motion.div animate={controls} className={className}>
      {children}
    </motion.div>
  );
}

/** Simulated async submit: `run(fn)` shows `loading` for a beat, then calls fn. */
export function useFakeSubmit(ms = 750) {
  const [loading, setLoading] = useState(false);
  const run = (fn: () => void) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      fn();
    }, ms);
  };
  return { loading, run };
}

export const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));
