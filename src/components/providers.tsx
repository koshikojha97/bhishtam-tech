"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useApp } from "@/lib/store";

/** Rehydrates the persisted store after mount (keeps SSR and first client render identical). */
function StoreHydrator() {
  useEffect(() => {
    void useApp.persist.rehydrate();
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <TooltipProvider delayDuration={200}>
        <StoreHydrator />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </TooltipProvider>
    </ThemeProvider>
  );
}
