"use client";

/**
 * Three.js background effects for the marketing site (raw three, no R3F).
 *  - variant "wave":  perspective grid of points rolling like a sine wave (hero backgrounds)
 *  - variant "globe": fibonacci-sphere point cloud with orbiting links (404 / CTA)
 * Pauses when off-screen or tab hidden, caps DPR at 2, reacts to pointer, and renders a
 * single static frame under prefers-reduced-motion. Load via <ParticleBackground/> (dynamic, no SSR).
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface ParticleFieldProps {
  variant?: "wave" | "globe";
  color?: string;
  className?: string;
  density?: number; // 0.5 – 1.5
  opacity?: number;
}

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uWave;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    if (uWave > 0.5) {
      p.y += sin(p.x * 0.35 + uTime * 0.9) * 0.55 + cos(p.z * 0.3 + uTime * 0.7) * 0.45;
    } else {
      float s = 1.0 + sin(uTime * 1.5 + aSeed * 6.28) * 0.02;
      p *= s;
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = uSize * (12.0 / depth) * (0.6 + aSeed * 0.8);
    vAlpha = smoothstep(42.0, 6.0, depth) * (0.35 + aSeed * 0.65);
  }
`;
const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;

export default function ParticleField({ variant = "wave", color = "#e12632", className, density = 1, opacity = 1 }: ParticleFieldProps) {
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
      return; // no WebGL — background just stays empty
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    const group = new THREE.Group();
    scene.add(group);

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: small ? 2.2 : 2.6 },
      uWave: { value: variant === "wave" ? 1 : 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    };

    const positions: number[] = [];
    const seeds: number[] = [];
    let lines: THREE.LineSegments | null = null;

    if (variant === "wave") {
      const cols = Math.round((small ? 60 : 110) * density);
      const rows = Math.round((small ? 40 : 60) * density);
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
          positions.push((i - cols / 2) * 0.55, 0, -j * 0.55 + 4);
          seeds.push(Math.random());
        }
      camera.position.set(0, 3.2, 9);
      camera.lookAt(0, 0, -6);
    } else {
      const n = Math.round((small ? 900 : 1800) * density);
      const golden = Math.PI * (3 - Math.sqrt(5));
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = golden * i;
        const v = new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r).multiplyScalar(5);
        pts.push(v);
        positions.push(v.x, v.y, v.z);
        seeds.push(Math.random());
      }
      // sparse "network" links between random neighbours
      const linkPos: number[] = [];
      for (let k = 0; k < (small ? 90 : 180); k++) {
        const a = pts[Math.floor(Math.random() * pts.length)];
        let best = pts[0];
        let bd = Infinity;
        for (let m = 0; m < 40; m++) {
          const b = pts[Math.floor(Math.random() * pts.length)];
          const d = a.distanceTo(b);
          if (d > 0.4 && d < bd) {
            bd = d;
            best = b;
          }
        }
        linkPos.push(a.x, a.y, a.z, best.x, best.y, best.z);
      }
      const lg = new THREE.BufferGeometry();
      lg.setAttribute("position", new THREE.Float32BufferAttribute(linkPos, 3));
      lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.18 * opacity }));
      group.add(lines);
      camera.position.set(0, 0, 13);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
    const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(geo, mat);
    group.add(points);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
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
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      if (variant === "globe") {
        group.rotation.y = t * 0.08 + pointer.x * 0.4;
        group.rotation.x = 0.25 + pointer.y * 0.25;
      } else {
        group.rotation.y = pointer.x * 0.08;
        group.position.y = -pointer.y * 0.3;
      }
      renderer.render(scene, camera);
    };
    if (reduced) {
      uniforms.uTime.value = 1.2;
      renderer.render(scene, camera);
    } else frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      lines?.geometry.dispose();
      (lines?.material as THREE.Material | undefined)?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [variant, color, density, opacity]);

  return <div ref={mount} aria-hidden className={className ?? "pointer-events-none absolute inset-0"} />;
}
