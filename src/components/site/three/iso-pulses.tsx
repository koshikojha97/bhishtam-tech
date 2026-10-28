"use client";

/**
 * Three.js "data pulses" layer for the Home hero.
 * Blue light pulses (with fading trails) travel along the same 30° isometric grid lines that the
 * hero background image draws, so packets appear to run *on* the dashed grid. Nodes near the
 * pointer glow brighter. Orthographic camera in CSS-pixel space.
 *
 * Grid geometry is measured from the Figma "Grid 2" layer at 1440: a vertex at (84.2, 78.4) and
 * parallel-line spacing of 81.5px (vertical), lines at ±tan(30°). The hero grid image is rendered
 * object-cover/top-center, so we apply the same scale + x-offset here.
 *
 * Pauses offscreen / tab hidden, DPR ≤ 2, one static frame under prefers-reduced-motion,
 * disposes everything on unmount. Load via dynamic import (ssr:false).
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const K = Math.tan(Math.PI / 6); // 0.5774
const VX = 84.2;
const VY = 78.4;
const SPACING = 81.5;
const CELL = SPACING / K / 2; // horizontal distance between vertices along a line = 70.6

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform vec2 uOffset;
  uniform vec2 uMouse;
  uniform float uPixel;
  attribute vec4 aLine;   // x: sign(+1/-1), y: c (line intercept @1440), z: start x, w: length (px @1440)
  attribute vec3 aMotion; // x: speed (cycles/s, sign = direction), y: phase, z: trail index 0..1
  varying float vAlpha;
  void main() {
    float prog = fract(uTime * abs(aMotion.x) + aMotion.y);
    float along = prog * (aLine.w + 90.0) - aMotion.z * 90.0;  // head + 90px trail
    float t = clamp(along, 0.0, aLine.w);
    float x = aMotion.x > 0.0 ? aLine.z + t : aLine.z + aLine.w - t;
    float y = aLine.x * ${K.toFixed(5)} * x + aLine.y;
    vec2 p = vec2(x, y) * uScale + uOffset;
    float onSeg = step(0.0, along) * step(along, aLine.w);
    float life = sin(3.14159 * prog);
    float trail = pow(1.0 - aMotion.z, 2.2);
    float fadeTop = smoothstep(140.0, 520.0, p.y);
    float d = distance(p, uMouse);
    float near = 1.0 - smoothstep(0.0, 260.0, d);
    vAlpha = onSeg * life * trail * fadeTop * (0.9 + near * 1.1);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p.x, -p.y, 0.0, 1.0);
    gl_PointSize = uPixel * (aMotion.z < 0.01 ? 9.0 : 4.0) * (1.0 + near * 0.6);
  }
`;
const FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor + a * 0.25, a * vAlpha);
  }
`;

export interface IsoPulsesProps {
  className?: string;
  color?: string;
  /** number of pulses (desktop); mobile uses ~half */
  count?: number;
}

export default function IsoPulses({ className, color = "#e12632", count = 46 }: IsoPulsesProps) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -1, 1);

    const uniforms = {
      uTime: { value: 0 },
      uScale: { value: 1 },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uPixel: { value: dpr },
      uColor: { value: new THREE.Color(color) },
    };

    // build pulses: each pulse = TRAIL points sharing a line segment between two grid vertices
    const TRAIL = 14;
    const n = Math.round(small ? count * 0.5 : count);
    const line: number[] = [];
    const motion: number[] = [];
    const c0p = VY - K * VX; // + family intercept through the reference vertex
    const c0m = VY + K * VX; // − family
    for (let i = 0; i < n; i++) {
      const sign = Math.random() < 0.5 ? 1 : -1;
      // pick a vertex inside the 1440×1114 hero, travel 2–5 cells along the line
      const col = Math.floor(Math.random() * 22) - 1;
      const row = Math.floor(Math.random() * 26) - 1;
      const vx = VX + col * CELL * 2 + (row % 2 ? CELL : 0);
      const vy = VY + row * (SPACING / 2);
      const c = vy - sign * K * vx;
      // snap c to the family lattice to stay exactly on grid lines
      const base = sign > 0 ? c0p : c0m;
      const cs = base + Math.round((c - base) / SPACING) * SPACING;
      const cells = 2 + Math.floor(Math.random() * 4);
      const len = cells * CELL;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const startX = vx - Math.floor(Math.random() * 3) * CELL;
      const speed = (0.08 + Math.random() * 0.12) * dir;
      const phase = Math.random();
      for (let t = 0; t < TRAIL; t++) {
        line.push(sign, cs, startX, len);
        motion.push(speed, phase, t / (TRAIL - 1));
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * TRAIL * 3), 3));
    geo.setAttribute("aLine", new THREE.Float32BufferAttribute(line, 4));
    geo.setAttribute("aMotion", new THREE.Float32BufferAttribute(motion, 3));
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    scene.add(points);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.left = 0;
      camera.right = w;
      camera.top = 0;
      camera.bottom = -h;
      camera.updateProjectionMatrix();
      // match the grid <img>: object-cover, top-center, natural size 1440×1068 at top 46
      const s = Math.max(w / 1440, 1);
      uniforms.uScale.value = s;
      uniforms.uOffset.value.set((w - 1440 * s) / 2, 46 * (1 - s));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const z = parseFloat(getComputedStyle(document.documentElement).zoom || "1") || 1;
      uniforms.uMouse.value.set((e.clientX / z - r.left), (e.clientY / z - r.top));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 });
    io.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      uniforms.uTime.value = clock.getElapsedTime() + 3;
      renderer.render(scene, camera);
    };
    if (reduced) {
      uniforms.uTime.value = 3.4;
      renderer.render(scene, camera);
    } else frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [color, count]);

  return <div ref={mount} aria-hidden className={className ?? "pointer-events-none absolute inset-0"} />;
}
