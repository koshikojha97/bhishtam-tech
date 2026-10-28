import type { Metadata } from "next";
import { Suspense } from "react";
import { DevicesView } from "@/components/devices/devices-view";

export const metadata: Metadata = { title: "Devices & Endpoints" };

export default function DevicesPage() {
  return (
    <Suspense>
      <DevicesView />
    </Suspense>
  );
}
