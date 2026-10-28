import { Laptop, Monitor, Server, Smartphone, type LucideIcon } from "lucide-react";
import type { Device } from "@/lib/store";

export const DEVICE_KINDS: Device["kind"][] = ["Laptop", "Desktop", "Mobile", "Server"];

export const KIND_ICON: Record<Device["kind"], LucideIcon> = {
  Laptop: Laptop,
  Desktop: Monitor,
  Mobile: Smartphone,
  Server: Server,
};

/** OS choices offered per device kind in the enroll dialog. */
export const OS_OPTIONS: Record<Device["kind"], string[]> = {
  Laptop: ["Windows 11", "Windows 10", "macOS 14", "macOS 13", "Ubuntu 22.04"],
  Desktop: ["Windows 11", "Windows 10", "macOS 14", "Ubuntu 22.04"],
  Mobile: ["iOS 17", "iOS 16", "Android 14", "Android 13"],
  Server: ["Windows Server 2022", "Ubuntu 22.04", "RHEL 9", "Debian 12"],
};

/** Groups an OS string into a family for the distribution chart. */
export function osFamily(os: string) {
  if (/server/i.test(os)) return "Windows Server";
  if (/^windows/i.test(os)) return "Windows";
  if (/^macos/i.test(os)) return "macOS";
  if (/^ios/i.test(os)) return "iOS";
  if (/^android/i.test(os)) return "Android";
  return "Linux";
}
