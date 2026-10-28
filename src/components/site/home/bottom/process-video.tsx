"use client";

/**
 * "Video" shown in the Process dialog — no external media: a looping GSAP scene built from the
 * process illustration layers, with chapter captions and a working play/pause + scrubbable progress bar.
 */
import Image from "next/image";
import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/components/site/gsap";
import { PROCESS_LAYERS, place } from "./shared";

const W = 1189;
const H = 640;
const CHAPTERS = ["Create an account", "Install our firewall", "Setup your network", "Be protected"];
const SEG = 3; // seconds per chapter
const TOTAL = SEG * CHAPTERS.length;

const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;

export function ProcessVideo() {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const layer = (k: string) => q(`[data-v=${k}]`);
      const caps = q("[data-cap]");
      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "expo.out" },
        onUpdate: () => setTime(tl.time()),
      });
      tlRef.current = tl;
      gsap.set([...layer("shield"), ...layer("dashboard"), ...layer("gear"), ...layer("tablet")], { opacity: 0 });
      gsap.set(caps, { opacity: 0, y: 16 });

      CHAPTERS.forEach((_, i) => {
        const t = i * SEG;
        tl.to(caps[i], { opacity: 1, y: 0, duration: 0.6 }, t + 0.1).to(caps[i], { opacity: 0, y: -12, duration: 0.4, ease: "power2.in" }, t + SEG - 0.45);
        tl.to(q("[data-dot]"), { backgroundColor: (j: number) => (j <= i ? "#e12632" : "#2a2a2a"), duration: 0.3 }, t);
      });
      // 01 — account: the dashboard builds up
      tl.fromTo(layer("dashboard"), { opacity: 0, yPercent: 12 }, { opacity: 1, yPercent: 0, duration: 1.6 }, 0.2);
      // 02 — firewall: the shield drops in
      tl.fromTo(layer("shield"), { opacity: 0, yPercent: -40 }, { opacity: 1, yPercent: 0, duration: 1.4, ease: "bounce.out" }, SEG + 0.2);
      // 03 — network: the tablet slides along the isometric axis, gear joins
      tl.fromTo(layer("tablet"), { opacity: 0, xPercent: -18, yPercent: 20 }, { opacity: 1, xPercent: 0, yPercent: 0, duration: 1.4 }, SEG * 2 + 0.1)
        .fromTo(layer("gear"), { opacity: 0, yPercent: 30 }, { opacity: 1, yPercent: 0, duration: 1.2 }, SEG * 2 + 0.5);
      // 04 — protected: scan sweep + glow, then everything settles out for the loop
      tl.fromTo(q("[data-scan]"), { xPercent: -120, opacity: 0 }, { xPercent: 120, opacity: 1, duration: 1.6, ease: "power2.inOut" }, SEG * 3 + 0.1)
        .fromTo(q("[data-glow]"), { opacity: 0 }, { opacity: 0.8, duration: 0.8, yoyo: true, repeat: 1, ease: "sine.inOut" }, SEG * 3 + 0.3)
        .to(q("[data-v]"), { opacity: 0, duration: 0.5, ease: "power2.in" }, TOTAL - 0.55)
        .set({}, {}, TOTAL);

      if (prefersReducedMotion()) {
        tl.pause(SEG * 3 + 1.8);
        setPlaying(false);
      }
    },
    { scope: root },
  );

  const toggle = () => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.paused(!tl.paused());
    setPlaying(!tl.paused());
  };
  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    tlRef.current?.time(Math.max(0, Math.min(0.999, (e.clientX - r.left) / r.width)) * TOTAL);
  };
  const chapter = Math.min(CHAPTERS.length - 1, Math.floor(time / SEG));

  return (
    <div ref={root} className="font-geist">
      <div className="relative isolate overflow-hidden bg-cx-bg" style={{ aspectRatio: `${W} / ${H}` }}>
        <Image src="/site/home/card-grid-bg.webp" alt="" fill unoptimized sizes="960px" className="-z-10 object-cover object-left-top" />
        <div
          data-glow
          className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
          style={{ background: "radial-gradient(circle, rgba(225,38,50,0.35), transparent 65%)" }}
        />
        {PROCESS_LAYERS.map((l) => (
          <div key={l.key} className="pointer-events-none absolute" style={place(l.x, l.y, l.w, W, H)}>
            <div data-v={l.key}>
              <Image src={l.src} alt="" width={Math.round(l.w)} height={Math.round(l.h)} unoptimized className="h-auto w-full" />
            </div>
          </div>
        ))}
        <div
          data-scan
          className="pointer-events-none absolute inset-y-0 left-0 w-full opacity-0"
          style={{ background: "linear-gradient(100deg, transparent 35%, rgba(225,38,50,0.28) 50%, transparent 65%)" }}
        />
        {/* captions */}
        <div className="absolute bottom-[16px] left-[16px] md:bottom-[28px] md:left-[32px]">
          {CHAPTERS.map((c, i) => (
            <p key={c} data-cap className="absolute bottom-0 left-0 whitespace-nowrap">
              <span className="block text-[14px] leading-[1.25] font-medium text-cx-accent md:text-[18px]">0{i + 1}/</span>
              <span className="block text-[18px] leading-[1.25] font-medium text-white md:text-[24px]">{c}</span>
            </p>
          ))}
        </div>
      </div>
      {/* controls */}
      <div className="flex items-center gap-[16px] border-t border-cx-line px-[16px] py-[12px]">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid size-[36px] shrink-0 cursor-pointer place-items-center rounded-full bg-cx-accent text-white transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          {playing ? <Pause className="size-[16px]" fill="currentColor" /> : <Play className="size-[16px] translate-x-[1px]" fill="currentColor" />}
        </button>
        <div
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${CHAPTERS[chapter]}, ${fmt(time)}`}
          tabIndex={0}
          onPointerDown={seek}
          onKeyDown={(e) => {
            const tl = tlRef.current;
            if (!tl) return;
            if (e.key === "ArrowRight") tl.time(Math.min(TOTAL - 0.01, tl.time() + 1));
            if (e.key === "ArrowLeft") tl.time(Math.max(0, tl.time() - 1));
          }}
          className="relative flex h-[20px] flex-1 cursor-pointer items-center gap-[4px] outline-none focus-visible:ring-2 focus-visible:ring-cx-accent"
        >
          {CHAPTERS.map((c, i) => (
            <span key={c} className="relative h-[4px] flex-1 overflow-hidden rounded-full bg-[#2a2a2a]">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-cx-accent"
                style={{ width: `${Math.max(0, Math.min(1, (time - i * SEG) / SEG)) * 100}%` }}
              />
            </span>
          ))}
        </div>
        <span className="shrink-0 text-[14px] text-cx-muted tabular-nums">
          {fmt(time)} / {fmt(TOTAL)}
        </span>
        <span className="hidden shrink-0 gap-[6px] sm:flex" aria-hidden>
          {CHAPTERS.map((c) => (
            <span key={c} data-dot className="size-[8px] rounded-full bg-[#2a2a2a]" />
          ))}
        </span>
      </div>
    </div>
  );
}
