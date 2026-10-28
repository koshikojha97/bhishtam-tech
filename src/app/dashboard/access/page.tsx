import type { Metadata } from "next";
import { AccessView } from "@/components/access/access-view";

export const metadata: Metadata = { title: "Access Control" };

export default function AccessPage() {
  return <AccessView />;
}
