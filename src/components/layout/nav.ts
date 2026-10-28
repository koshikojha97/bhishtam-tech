import { Bug, Briefcase, Laptop, LayoutDashboard, Server, Settings, ShieldAlert, Siren, Users } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", title: "Security Overview", icon: LayoutDashboard },
  { href: "/dashboard/threats", label: "Threats", title: "Threats & Alerts", icon: ShieldAlert },
  { href: "/dashboard/incidents", label: "Incidents", title: "Incidents", icon: Siren },
  { href: "/dashboard/vulnerabilities", label: "Vulnerabilities", title: "Vulnerabilities", icon: Bug },
  { href: "/dashboard/assets", label: "Assets", title: "Assets", icon: Server },
  { href: "/dashboard/devices", label: "Devices", title: "Devices & Endpoints", icon: Laptop },
  { href: "/dashboard/services", label: "Services", title: "Security Services", icon: Briefcase },
  { href: "/dashboard/access", label: "Access Control", title: "Access Control", icon: Users },
  { href: "/dashboard/settings", label: "Settings", title: "Settings", icon: Settings },
] as const;

export function getActiveNav(pathname: string) {
  return (
    NAV_ITEMS.find((i) => (i.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(i.href))) ??
    NAV_ITEMS[0]
  );
}
