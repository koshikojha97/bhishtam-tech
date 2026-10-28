"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/shared/logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NAV_ITEMS, getActiveNav } from "./nav";

export function SidebarNav({
  onNavigate,
  layoutId = "nav-active",
  collapsed = false,
}: {
  onNavigate?: () => void;
  layoutId?: string;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const active = getActiveNav(pathname);

  return (
    <nav className="flex flex-col gap-[4px] xl:gap-[4px]">
      {NAV_ITEMS.map((item, i) => {
        const isActive = item.href === active.href;
        const Icon = item.icon;
        const link = (
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-label={collapsed ? item.label : undefined}
            className={cn(
              "group relative flex h-[42px] items-center gap-[14px] pl-[28px] text-[14px] font-medium transition-colors xl:h-[46px] xl:gap-[16px] xl:text-[15px]",
              isActive ? "text-bd-primary" : "text-bd-nav hover:text-bd-primary",
            )}
          >
            <Icon className={cn("size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 xl:size-[20px]", isActive && "text-bd-royal")} strokeWidth={1.7} />
            <span
              className={cn(
                "whitespace-nowrap transition-[opacity,translate] duration-300 ease-(--bd-ease)",
                collapsed ? "pointer-events-none opacity-0" : "opacity-100 group-hover:translate-x-1",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.35, ease: "easeOut" }}
            className="relative"
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-y-0 right-[12px] left-[12px] rounded-[8px] border border-bd-border bg-[linear-gradient(90deg,rgb(225_38_50/0.16),transparent_70%)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              link
            )}
          </motion.div>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const collapsed = useApp((s) => s.sidebarCollapsed);
  const toggle = useApp((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden border-r border-bd-border bg-bd-surface transition-[width] duration-300 ease-(--bd-ease) will-change-[width] lg:block",
        collapsed ? "w-[80px]" : "w-[231px] xl:w-[250px]",
      )}
    >
      <div className="flex h-[85px] items-center overflow-hidden pl-[22px] xl:h-[100px]">
        <Logo collapsed={collapsed} />
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-label={collapsed ? "Expand menu" : "Collapse menu"}
        aria-expanded={!collapsed}
        className="absolute top-[42px] -right-[13px] flex size-[26px] -translate-y-1/2 items-center justify-center rounded-full border border-bd-card-border bg-bd-surface text-bd-muted transition-colors hover:border-bd-royal hover:text-bd-royal xl:top-[50px]"
      >
        <ChevronsLeft className={cn("size-[16px] transition-transform duration-300", collapsed && "rotate-180")} />
      </button>
      <div className="overflow-hidden pt-[10px] xl:pt-[14px]">
        <SidebarNav collapsed={collapsed} />
      </div>
    </aside>
  );
}

/** Content column that leaves room for the fixed sidebar at its current width. */
export function SidebarOffset({ children }: { children: React.ReactNode }) {
  const collapsed = useApp((s) => s.sidebarCollapsed);
  return (
    <div className={cn("transition-[padding] duration-300 ease-(--bd-ease)", collapsed ? "lg:pl-[80px]" : "lg:pl-[231px] xl:pl-[250px]")}>
      {children}
    </div>
  );
}
