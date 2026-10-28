"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Laptop, Radar, Search, Server, ShieldAlert, ShieldCheck, Siren, UserPlus } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useApp } from "@/lib/store";
import { NAV_ITEMS } from "./nav";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { label: "Run a security scan", icon: Radar, href: "/dashboard#quick-scan" },
  { label: "Report an incident", icon: Siren, href: "/dashboard/incidents?new=1" },
  { label: "Enroll a device", icon: Laptop, href: "/dashboard/devices?new=1" },
  { label: "Add an asset", icon: Server, href: "/dashboard/assets?new=1" },
  { label: "Invite a team member", icon: UserPlus, href: "/dashboard/access?new=1" },
  { label: "Change password", icon: ShieldCheck, href: "/dashboard/settings?tab=security" },
];

/** Header search field that opens a ⌘K / Ctrl+K command palette over pages, actions, alerts, assets, devices and incidents. */
export function SearchCommand({ className, shortcuts = false }: { className?: string; /** register Ctrl/⌘+K and "/" — enable on exactly one instance */ shortcuts?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const alerts = useApp((s) => s.alerts);
  const assets = useApp((s) => s.assets);
  const devices = useApp((s) => s.devices);
  const incidents = useApp((s) => s.incidents);

  useEffect(() => {
    if (!shortcuts) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "/" && !(e.target as HTMLElement)?.closest("input,textarea,[contenteditable=true]")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        title="Search (Ctrl+K)"
        aria-keyshortcuts="Control+K Meta+K"
        onClick={() => setOpen(true)}
        className={cn(
          "group flex items-center gap-[12px] rounded-[8px] border border-bd-card-border bg-bd-page pr-[12px] pl-[14px] text-left transition-colors hover:border-bd-placeholder focus-visible:border-bd-royal focus-visible:outline-none",
          className,
        )}
      >
        <Search className="size-[16px] shrink-0 text-bd-muted transition-transform group-hover:scale-110 xl:size-[18px]" strokeWidth={1.8} />
        <span className="flex-1 truncate text-[13px] text-bd-placeholder xl:text-[14px]">Search threats, assets…</span>
        {shortcuts && <kbd className="hidden rounded-[4px] border border-bd-card-border px-[6px] py-[1px] text-[11px] text-bd-muted xl:inline">Ctrl K</kbd>}
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Search Bhishtam Tech" description="Search pages, alerts, assets, devices and incidents" className="rounded-[8px] border-bd-border sm:max-w-[560px]">
        <CommandInput placeholder="Search pages, alerts, assets, devices…" />
        <CommandList className="max-h-[420px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {NAV_ITEMS.map((n) => (
              <CommandItem key={n.href} value={`page ${n.label} ${n.title}`} onSelect={() => go(n.href)}>
                <n.icon className="size-[16px] text-bd-muted" />
                {n.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick actions">
            {ACTIONS.map((a) => (
              <CommandItem key={a.label} value={`action ${a.label}`} onSelect={() => go(a.href)}>
                <a.icon className="size-[16px] text-bd-muted" />
                {a.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Alerts">
            {alerts.slice(0, 20).map((a) => (
              <CommandItem key={a.id} value={`alert ${a.ref} ${a.title} ${a.category} ${a.asset} ${a.ip} ${a.severity}`} onSelect={() => go(`/dashboard/threats?q=${encodeURIComponent(a.ref)}`)}>
                <ShieldAlert className="size-[16px] text-bd-red" />
                <span className="truncate">{a.title}</span>
                <CommandShortcut>{a.severity}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Incidents">
            {incidents.map((i) => (
              <CommandItem key={i.id} value={`incident ${i.ref} ${i.title} ${i.owner}`} onSelect={() => go(`/dashboard/incidents?q=${encodeURIComponent(i.ref)}`)}>
                <Siren className="size-[16px] text-bd-royal" />
                <span className="truncate">
                  {i.ref} · {i.title}
                </span>
                <CommandShortcut>{i.status}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Assets">
            {assets.map((a) => (
              <CommandItem key={a.id} value={`asset ${a.name} ${a.type} ${a.ip} ${a.owner}`} onSelect={() => go(`/dashboard/assets?q=${encodeURIComponent(a.name)}`)}>
                <Server className="size-[16px] text-bd-muted" />
                <span className="truncate">{a.name}</span>
                <CommandShortcut>{a.type}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Devices">
            {devices.map((d) => (
              <CommandItem key={d.id} value={`device ${d.name} ${d.user} ${d.os}`} onSelect={() => go(`/dashboard/devices?q=${encodeURIComponent(d.name)}`)}>
                <Laptop className="size-[16px] text-bd-muted" />
                <span className="truncate">
                  {d.name} · {d.user}
                </span>
                <CommandShortcut>{d.status}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
