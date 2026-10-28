import type { Metadata } from "next";
import { Suspense } from "react";
import { ThreatsView } from "@/components/threats/threats-view";

export const metadata: Metadata = { title: "Threats & Alerts" };

export default function ThreatsPage() {
  return (
    <Suspense>
      <ThreatsView />
    </Suspense>
  );
}
