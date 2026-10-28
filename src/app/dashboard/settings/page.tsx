import type { Metadata } from "next";
import { Suspense } from "react";
import { FadeUp, Stagger } from "@/components/shared/motion";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <Stagger>
      <FadeUp>
        <Suspense fallback={<div className="h-[600px] rounded-[8px] border border-bd-border bg-bd-surface" />}>
          <SettingsTabs />
        </Suspense>
      </FadeUp>
    </Stagger>
  );
}
