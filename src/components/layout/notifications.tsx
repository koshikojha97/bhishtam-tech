"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, Bug, CheckCheck, Info, Laptop, ShieldAlert, ShieldCheck, Siren, Trash2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApp, timeAgo, type Notification } from "@/lib/store";
import { cn } from "@/lib/utils";

const KIND: Record<Notification["kind"], { icon: React.ElementType; bg: string; fg: string }> = {
  threat: { icon: ShieldAlert, bg: "bg-bd-tint-red", fg: "text-bd-red" },
  incident: { icon: Siren, bg: "bg-bd-tint-royal", fg: "text-bd-royal" },
  vulnerability: { icon: Bug, bg: "bg-bd-tint-yellow", fg: "text-bd-orange" },
  device: { icon: Laptop, bg: "bg-bd-tint-teal", fg: "text-bd-teal" },
  security: { icon: ShieldCheck, bg: "bg-bd-tint-teal", fg: "text-bd-teal" },
  info: { icon: Info, bg: "bg-bd-input", fg: "text-bd-muted" },
};

export function NotificationsButton({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const items = useApp((s) => s.notifications);
  const { markRead, markAllRead, removeNotification, clearNotifications } = useApp.getState();
  const unread = items.filter((n) => !n.read).length;
  const list = filter === "unread" ? items.filter((n) => !n.read) : items;

  const openItem = (n: Notification) => {
    markRead(n.id);
    setOpen(false);
    if (n.href) router.push(n.href);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "relative flex size-[40px] items-center justify-center rounded-[8px] border border-bd-card-border transition-colors hover:border-bd-royal data-[state=open]:border-bd-royal xl:size-[44px]",
            className,
          )}
        >
          <motion.span
            key={unread}
            animate={unread ? { rotate: [0, -14, 12, -8, 6, 0] } : {}}
            transition={{ duration: 0.7 }}
            className="flex"
          >
            <Bell className="size-[18px] text-bd-muted xl:size-[20px]" strokeWidth={1.7} />
          </motion.span>
          <AnimatePresence>
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-[2px] -right-[2px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-bd-surface bg-bd-royal px-[4px] text-[10px] leading-none font-semibold text-white"
              >
                {unread > 9 ? "9+" : unread}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={12} className="w-[calc(100vw-30px)] max-w-[380px] rounded-[8px] border-bd-border p-0 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between px-[20px] pt-[18px] pb-[12px]">
          <div>
            <p className="text-[18px] font-semibold text-bd-primary">Notifications</p>
            <p className="text-[12px] text-bd-muted">{unread ? `${unread} unread` : "You're all caught up"}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={!unread}
                onClick={markAllRead}
                aria-label="Mark all as read"
                className="flex size-[34px] items-center justify-center rounded-full text-bd-muted transition-colors hover:bg-bd-page hover:text-bd-royal disabled:opacity-40"
              >
                <CheckCheck className="size-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Mark all as read</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-[6px] px-[20px] pb-[10px]">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "relative rounded-[6px] px-[14px] py-[5px] text-[13px] font-medium capitalize transition-colors",
                filter === f ? "text-white" : "text-bd-muted hover:text-bd-primary",
              )}
            >
              {filter === f && <motion.span layoutId="notif-filter" className="absolute inset-0 rounded-[6px] bg-bd-royal" />}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
        <div className="max-h-[min(360px,60vh)] overflow-y-auto overscroll-contain border-t border-bd-border">
          {list.length === 0 ? (
            <div className="flex flex-col items-center gap-[8px] py-[40px] text-bd-muted">
              <BellOff className="size-[28px]" />
              <p className="text-[14px]">No notifications</p>
            </div>
          ) : (
            <ul>
              <AnimatePresence initial={false}>
                {list.map((n) => {
                  const k = KIND[n.kind];
                  return (
                    <motion.li
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0 }}
                      className="group relative border-b border-bd-border last:border-0"
                    >
                      <button type="button" onClick={() => openItem(n)} className={cn("flex w-full gap-[12px] px-[20px] py-[14px] pr-[44px] text-left transition-colors hover:bg-bd-page", !n.read && "bg-bd-unread")}>
                        <span className={cn("flex size-[38px] shrink-0 items-center justify-center rounded-[8px]", k.bg, k.fg)}>
                          <k.icon className="size-[18px]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-[6px]">
                            <span className="truncate text-[14px] font-medium text-bd-text">{n.title}</span>
                            {!n.read && <span className="size-[7px] shrink-0 rounded-full bg-bd-royal" />}
                          </span>
                          <span className="mt-[2px] line-clamp-2 block text-[13px] text-bd-muted">{n.body}</span>
                          <span className="mt-[4px] block text-[11px] text-bd-placeholder">{timeAgo(n.date)}</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={() => removeNotification(n.id)}
                        className="absolute top-[12px] right-[12px] flex size-[26px] items-center justify-center rounded-full text-bd-muted opacity-0 transition hover:bg-bd-surface hover:text-bd-red group-hover:opacity-100 focus-visible:opacity-100 max-lg:opacity-100"
                      >
                        <X className="size-[14px]" />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="flex justify-end border-t border-bd-border px-[20px] py-[10px]">
            <button type="button" onClick={clearNotifications} className="flex items-center gap-[6px] text-[13px] font-medium text-bd-muted hover:text-bd-red">
              <Trash2 className="size-[14px]" /> Clear all
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
