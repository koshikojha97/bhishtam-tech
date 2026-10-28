"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EditProfileForm } from "./edit-profile-form";
import { PreferencesForm } from "./preferences-form";
import { SecurityForm } from "./security-form";

const TABS = [
  { id: "edit-profile", label: "Edit Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "security", label: "Security" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v);

export function SettingsTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const param = params.get("tab");
  const [tab, setTab] = useState<TabId>(isTab(param) ? param : "edit-profile");

  // keep in sync with back/forward navigation
  useEffect(() => {
    if (isTab(param)) setTab(param);
    else if (param === null) setTab("edit-profile");
  }, [param]);

  const select = (id: TabId) => {
    setTab(id);
    const sp = new URLSearchParams(params.toString());
    if (id === "edit-profile") sp.delete("tab");
    else sp.set("tab", id);
    const q = sp.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  return (
    <div className="rounded-[8px] border border-bd-border bg-bd-surface px-[18px] pt-[18px] pb-[24px] md:px-[24px] xl:px-[32px] xl:pt-[26px] xl:pb-[32px]">
      <div role="tablist" aria-label="Settings" className="relative flex gap-[24px] xl:gap-[36px]">
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-bd-border" />
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`settings-tab-${t.id}`}
              aria-selected={active}
              aria-controls={`settings-panel-${t.id}`}
              onClick={() => select(t.id)}
              className={cn(
                "relative cursor-pointer pb-[10px] text-[13px] leading-[1.21] font-medium whitespace-nowrap transition-colors xl:pb-[12px] xl:text-[15px]",
                active ? "text-bd-royal" : "text-bd-muted hover:text-bd-primary",
              )}
            >
              {t.label}
              {active && (
                <motion.span
                  layoutId="settings-tab-underline"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-bd-royal"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          role="tabpanel"
          id={`settings-panel-${tab}`}
          aria-labelledby={`settings-tab-${tab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === "edit-profile" && <EditProfileForm />}
          {tab === "preferences" && <PreferencesForm />}
          {tab === "security" && <SecurityForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
