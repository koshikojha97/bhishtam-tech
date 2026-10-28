"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SiteLogo } from "@/components/site/logo";
import { A, SectionTag } from "@/components/site/ui";
import { BugCursor } from "@/components/site/bug-cursor";
import { ParticleBackground } from "@/components/site/three/particle-background";

const EASE = [0.22, 1, 0.36, 1] as const;

const float = (delay: number, y = 12) => ({
  animate: { y: [0, -y, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay },
});

const STATS = [
  { value: "575", suffix: "+", label: "Successful Projects" },
  { value: "99", suffix: "%", label: "Customer satisfaction" },
];

/** Brand panel on the left (≥1024px), in the marketing-site style: particle globe, isometric lock + shield, stats. */
function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden border-r border-cx-line bg-cx-bg-2 lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-[48px] xl:p-[60px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/site/home/hero-grid.webp')] bg-cover bg-center opacity-40" />
      <ParticleBackground variant="globe" color="#e12632" density={0.9} opacity={0.8} className="absolute inset-0" />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <SiteLogo />
      </motion.div>

      <div aria-hidden className="relative mx-auto h-[300px] w-full max-w-[420px] xl:h-[340px]">
        <span className="absolute top-1/2 left-1/2 size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(225,38,50,0.28),transparent)] blur-[10px]" />
        <motion.div
          initial={{ opacity: 0, y: -80, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="absolute top-0 left-[40px] w-[150px] xl:w-[170px]"
        >
          <motion.div {...float(0, 14)}>
            <Image src="/site/home/hero-lock.webp" alt="" width={145} height={257} className="h-auto w-full" priority />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="absolute right-[50px] bottom-0 w-[130px] xl:w-[150px]"
        >
          <motion.div {...float(1.2, 10)}>
            <Image src="/site/home/hero-shield.webp" alt="" width={128} height={215} className="h-auto w-full" priority />
          </motion.div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative">
        <SectionTag>Secure access</SectionTag>
        <h2 className="mt-[16px] text-[28px] leading-[1.25] text-white xl:text-[36px]">
          Protecting your <A>digital</A> frontier
        </h2>
        <p className="mt-[12px] max-w-[420px] text-[15px] leading-[1.6] text-cx-muted xl:text-[16px]">
          Security experts on all technologies &amp; platforms — sign in to manage your projects and account.
        </p>
        <dl className="mt-[28px] flex gap-[40px]">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-[4px]">
              <dt className="text-[14px] text-cx-muted">{s.label}</dt>
              <dd className="text-[36px] leading-none font-medium text-white xl:text-[44px]">
                {s.value}
                <span className="text-cx-accent">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </div>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="site-root flex min-h-screen bg-cx-bg font-geist text-white antialiased selection:bg-cx-accent selection:text-white">
      <BrandPanel />
      <div className="relative flex flex-1 flex-col px-[20px] py-[24px] md:px-[40px] lg:px-[48px] lg:py-[32px]">
        <div className="flex items-center justify-between gap-[16px] lg:justify-end">
          <div className="lg:hidden">
            <SiteLogo />
          </div>
          <Link href="/" className="group inline-flex items-center gap-[6px] text-[14px] text-cx-muted transition-colors hover:text-white md:text-[16px]">
            <ArrowLeft className="size-[16px] transition-transform duration-300 group-hover:-translate-x-[4px]" strokeWidth={1.6} />
            <span className="max-sm:sr-only">Back to website</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-[40px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="w-full max-w-[480px] rounded-[8px] border border-cx-line bg-cx-bg-2 p-[24px] md:p-[40px]"
          >
            <h1 className="text-[24px] leading-[1.25] text-white md:text-[30px]">{title}</h1>
            <p className="mt-[10px] text-[14px] leading-[1.5] text-cx-muted md:text-[16px]">{subtitle}</p>
            <div className="mt-[28px] md:mt-[32px]">{children}</div>
          </motion.div>
        </div>
      </div>
      <BugCursor />
    </div>
  );
}
