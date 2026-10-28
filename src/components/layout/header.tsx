"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Menu, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "@/components/shared/logo";
import { SidebarNav } from "./sidebar";
import { getActiveNav } from "./nav";
import { NotificationsButton } from "./notifications";
import { SearchCommand } from "./search-command";
import { UserMenu, UserAvatar, useLogout } from "./user-menu";
import { useApp } from "@/lib/store";

export function Header() {
  const pathname = usePathname();
  const active = getActiveNav(pathname);
  const [open, setOpen] = useState(false);
  const user = useApp((s) => s.user);
  const { ask: askLogout, dialog: logoutDialog } = useLogout();

  return (
    <header className="sticky top-0 z-20 border-b border-bd-border bg-bd-surface">
      {/* Mobile header (< 1024px) */}
      <div className="px-[25px] pt-[25px] pb-[20px] lg:hidden">
        <div className="flex items-center justify-between">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-[8px] border border-bd-card-border p-[8px] text-bd-primary">
            <Menu className="size-[18px]" />
          </button>
          <AnimatePresence mode="wait">
            <motion.h1
              key={active.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-[16px] text-bd-primary"
            >
              {active.title}
            </motion.h1>
          </AnimatePresence>
          <div className="flex items-center gap-[10px]">
            <NotificationsButton className="size-[35px] [&_svg]:size-[18px]" />
            <UserMenu avatarClassName="size-[35px] xl:size-[35px]" />
          </div>
        </div>
        <SearchCommand className="mt-[20px] h-[40px] w-full" />
      </div>

      {/* Tablet / desktop header */}
      <div className="hidden h-[85px] pr-[30px] pl-[25px] lg:block xl:h-[100px] xl:pr-[40px] xl:pl-[40px]">
        <div className="flex h-full w-full items-center justify-between">
          <AnimatePresence mode="wait">
            <motion.h1
              key={active.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-[20px] text-bd-primary xl:text-[22px]"
            >
              {active.title}
            </motion.h1>
          </AnimatePresence>
          <div className="flex items-center">
            <SearchCommand shortcuts className="h-[40px] w-[255px] xl:h-[44px] xl:w-[300px]" />
            <div className="ml-[20px] flex items-center gap-[20px] xl:ml-[30px] xl:gap-[30px]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/settings"
                    aria-label="Settings"
                    className="flex size-[40px] items-center justify-center rounded-[8px] border border-bd-card-border transition-colors hover:border-bd-royal xl:size-[44px]"
                  >
                    <motion.span whileHover={{ rotate: 60 }} whileTap={{ scale: 0.9 }} className="flex">
                      <Settings className="size-[18px] text-bd-muted xl:size-[20px]" strokeWidth={1.7} />
                    </motion.span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
              <NotificationsButton />
            </div>
            <div className="ml-[25px] xl:ml-[35px]">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="flex w-[270px] flex-col border-r-bd-border bg-bd-surface p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-[85px] items-center pl-[24px]">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarNav layoutId="nav-active-mobile" onNavigate={() => setOpen(false)} />
          </div>
          <div className="flex items-center gap-[10px] border-t border-bd-border p-[16px]">
            <UserAvatar className="size-[40px] xl:size-[40px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-bd-primary">{user.name}</p>
              <p className="truncate text-[12px] text-bd-muted">{user.email}</p>
            </div>
            <button
              type="button"
              aria-label="Log out"
              onClick={() => {
                setOpen(false);
                askLogout();
              }}
              className="flex size-[34px] items-center justify-center rounded-[8px] text-bd-red hover:bg-bd-tint-red-soft"
            >
              <LogOut className="size-[18px]" />
            </button>
          </div>
        </SheetContent>
      </Sheet>
      {logoutDialog}
    </header>
  );
}
