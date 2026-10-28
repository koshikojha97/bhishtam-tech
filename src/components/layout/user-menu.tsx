"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Settings, ShieldCheck, SlidersHorizontal, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { clearSession, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function UserAvatar({ className }: { className?: string }) {
  const user = useApp((s) => s.user);
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <Avatar className={cn("size-[50px] xl:size-[60px]", className)}>
      <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
      <AvatarFallback className="bg-bd-input font-semibold text-bd-primary">{initials}</AvatarFallback>
    </Avatar>
  );
}

/** Confirm + sign out. Exported so the mobile drawer can reuse it. */
export function useLogout() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dialog = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="rounded-[8px] border-bd-border bg-bd-surface sm:max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[20px] text-bd-primary">Log out of Bhishtam Tech?</AlertDialogTitle>
          <AlertDialogDescription className="text-bd-muted">You&apos;ll need to sign in again to access your dashboard.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-[8px] border-bd-card-border bg-transparent text-bd-primary">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-[8px] bg-white text-black hover:bg-bd-royal hover:text-white"
            onClick={() => {
              clearSession();
              toast.success("Signed out");
              router.replace("/login");
              router.refresh();
            }}
          >
            Log out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return { ask: () => setOpen(true), dialog };
}

export function UserMenu({ avatarClassName }: { avatarClassName?: string }) {
  const router = useRouter();
  const user = useApp((s) => s.user);
  const { ask, dialog } = useLogout();
  const items = [
    { label: "My Profile", icon: User, href: "/dashboard/settings" },
    { label: "Preferences", icon: SlidersHorizontal, href: "/dashboard/settings?tab=preferences" },
    { label: "Security", icon: ShieldCheck, href: "/dashboard/settings?tab=security" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button type="button" aria-label="Account menu" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-bd-royal/30">
            <UserAvatar className={avatarClassName} />
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="w-[240px] rounded-[8px] border-bd-border p-[6px]">
          <DropdownMenuLabel className="flex items-center gap-[10px] px-[10px] py-[8px]">
            <UserAvatar className="size-[40px] xl:size-[40px]" />
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold text-bd-primary">{user.name}</span>
              <span className="block truncate text-[12px] font-normal text-bd-muted">{user.email}</span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {items.map((i) => (
              <DropdownMenuItem key={i.label} onSelect={() => router.push(i.href)} className="cursor-pointer rounded-[6px] px-[10px] py-[8px] text-[14px] text-bd-primary focus:bg-bd-input focus:text-bd-royal">
                <i.icon className="size-[16px]" />
                {i.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={ask} className="cursor-pointer rounded-[6px] px-[10px] py-[8px] text-[14px] text-bd-red focus:bg-bd-tint-red-soft focus:text-bd-red">
            <LogOut className="size-[16px] text-bd-red" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialog}
    </>
  );
}
