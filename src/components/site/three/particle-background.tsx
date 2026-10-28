"use client";

import dynamic from "next/dynamic";
import type { ParticleFieldProps } from "./particle-field";

/** Lazy, client-only Three.js background (keeps three.js out of the initial bundle). */
const ParticleField = dynamic(() => import("./particle-field"), { ssr: false, loading: () => null });

export function ParticleBackground(props: ParticleFieldProps) {
  return <ParticleField {...props} />;
}
