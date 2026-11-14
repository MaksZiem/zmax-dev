"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Scroll-driven galactic scene for the hero -> "About" transition.
 *
 * The stage (parent element) contains a tall "hero track" in which the hero is pinned.
 * While scrolling through that track (progress T):
 *   - the hero copy blurs and fades out (CSS, via --t on the stage),
 *   - the nebula flows down like smoke and a fog bank rises from the bottom (shader).
 * Then "About" scrolls in (progress A): the fog thins out and every [data-fog] element
 * emerges from it (CSS, via a per-element --fog value).
 */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2  uRes;
uniform vec2  uMouse;
uniform float uT;     // pinned hero transition: 0 -> 1
uniform float uA;     // "About" entering: 0 (top edge at the bottom) -> 1 (top edge at the top)
uniform float uP;     // projects section on screen: 0 -> 1 (smoke returns, cards rise out of it)
uniform float uDark;
uniform vec3  uBg;
varying vec2 vUv;

// Dave Hoskins' hash without sine: stable on every GPU, no striping
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

// regular dot grid (cell size in p units); returns the dot mask of the current cell
float dotGrid(vec2 p, float cell) {
  vec2 f = fract(p / cell) - 0.5;
  return smoothstep(0.1, 0.04, length(f));
}

void main() {
  vec2 frag = vUv * uRes;
  vec2 p = (frag - 0.5 * uRes) / uRes.y;
  float t = uTime;
  float T = uT;
  float Te = T * T * (3.0 - 2.0 * T);
  vec2 m = uMouse * 0.04 * (1.0 - T);

  // ---- nebula flowing down like smoke
  // the pattern is advected downwards and stretched into trails; its centre sinks and spreads out
  vec2 c = mix(vec2(0.45, 0.1), vec2(0.0, -0.45), Te);
  vec2 np = (p - c * 0.35) * 1.3 + m;
  np.y = np.y * mix(1.0, 0.55, Te) + Te * 2.4;              // flow down + vertical trails
  np.x += sin(np.y * 2.0 + t * 0.3) * 0.12 * Te;            // smoke wobble
  vec2 q = vec2(fbm(np + vec2(0.0, t * 0.03)), fbm(np + vec2(5.2, -t * 0.025)));
  float n = fbm(np * 1.4 + 2.2 * q + vec2(t * 0.02, t * 0.05 * Te));
  vec2 dc = (p - c) * vec2(mix(0.75, 0.45, Te), 1.0);
  float focus = smoothstep(1.3, 0.0, length(dc));
  float neb = smoothstep(0.42, 0.95, n) * (0.25 + 0.85 * focus);
  // hero copy (left) stays readable while it is on screen
  float calmHero = mix(0.3, 1.0, smoothstep(-0.2, 0.55, p.x) + smoothstep(0.35, 0.6, abs(p.y)));
  neb *= mix(calmHero, 1.0, smoothstep(0.0, 0.4, T));
  neb *= 1.0 + Te * (1.0 - Te) * 1.8; // the smoke glows brighter while it pours down
  // in "About" the smoke settles into a faint haze
  neb *= mix(1.0, 0.35, smoothstep(0.2, 1.0, uA));
  neb *= mix(1.0, 2.2, uP);                            // smoke thickens again behind the projects

  // ---- fog bank rising from the bottom during the pinned transition, thinning as "About" arrives
  float wave = (fbm(p * 1.8 + vec2(t * 0.04, -t * 0.03)) - 0.5) * 0.45;
  float fogLine = mix(-0.95, 0.75, smoothstep(0.25, 0.95, T));
  float fog = smoothstep(fogLine + 0.35, fogLine - 0.3, p.y + wave);
  vec2 fp = p * vec2(1.2, 2.2) + vec2(t * 0.025, -t * 0.05 - T * 1.5);
  float fogTex = 0.3 + 0.7 * smoothstep(0.25, 0.8, fbm(fp + fbm(fp * 1.7) * 0.8)); // wispy
  fog *= fogTex;
  fog *= 1.0 - smoothstep(0.15, 0.95, uA) * 0.85;
  // projects: a bank of smoke along the bottom of the screen that the cards rise out of
  float fogBottom = smoothstep(-0.12, -0.5, p.y + wave * 0.8) * fogTex * uP;
  fog = max(fog, fogBottom * 0.95);

  vec3 violet = vec3(0.55, 0.38, 1.0);
  vec3 cyan   = vec3(0.30, 0.72, 1.0);
  vec3 green  = vec3(0.235, 0.81, 0.57);
  vec3 nebCol = mix(violet, cyan, smoothstep(0.3, 0.8, q.x));
  nebCol = mix(nebCol, green, smoothstep(0.55, 0.85, q.y) * 0.6);
  vec3 fogCol = mix(violet, cyan, fogTex * 0.8);

  // ---- static dot grid underneath, lit up by the smoke drifting over it (dimmed inside the fog)
  float dots = dotGrid(p + m * 1.5, 0.026);
  float st = dots * (0.05 + clamp(neb * 1.8, 0.0, 1.0) * 0.55);
  st *= 1.0 - clamp(fog, 0.0, 1.0) * 0.85;

  // ---- compose
  vec3 col = uBg;
  float grain = hash(frag + floor(fract(t * 0.5) * 24.0) * 97.0) - 0.5;
  if (uDark > 0.5) {
    col += nebCol * neb * 0.5;
    col += (fogCol * 0.16 + vec3(0.05)) * fog;
    col += mix(nebCol, vec3(1.0), 0.45) * st;
    col += grain * 0.06;
  } else {
    col = mix(col, mix(nebCol, vec3(1.0), 0.35), neb * 0.4);
    col = mix(col, mix(fogCol, vec3(1.0), 0.75), fog * 0.7);
    col -= vec3(0.55) * st * 0.6;
    col += grain * 0.05;
  }
  col = mix(col, uBg, smoothstep(0.75, 1.25, length(p * vec2(0.7, 1.0))) * 0.6);

  gl_FragColor = vec4(col, 1.0);
}
`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function readBg(): THREE.Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--background").trim() || "#ffffff";
  // take the CSS colour as-is (the shader works in display space, no colour management)
  return new THREE.Color().setStyle(raw, THREE.LinearSRGBColorSpace);
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvas?.parentElement;
    const stage = wrap?.parentElement;
    if (!canvas || !wrap || !stage) return;

    const track = stage.querySelector<HTMLElement>("[data-hero-track]");
    const about = stage.querySelector<HTMLElement>("#about");
    const projects = stage.querySelector<HTMLElement>("#projects");
    const fogEls = Array.from(stage.querySelectorAll<HTMLElement>("[data-fog]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // ---- scroll state (drives CSS even when WebGL is unavailable)
    let T = 0;
    let A = 0;
    let P = 0;
    const updateScroll = () => {
      const vh = window.innerHeight;
      if (track) {
        const r = track.getBoundingClientRect();
        T = clamp01(-r.top / Math.max(1, r.height - vh));
      }
      if (about) A = clamp01((vh - about.getBoundingClientRect().top) / vh);
      if (projects) {
        const r = projects.getBoundingClientRect();
        // fades in as the section enters, fades out as its end scrolls past
        P = clamp01((vh - r.top) / (vh * 0.6)) * clamp01((r.bottom - vh * 0.2) / (vh * 0.6));
      }
      stage.style.setProperty("--t", T.toFixed(4));
      // each [data-fog] element is hidden in fog near the bottom and clears as it rises
      for (const el of fogEls) {
        const top = el.getBoundingClientRect().top;
        const f = reduceMotion.matches ? 0 : clamp01((top - vh * 0.55) / (vh * 0.4));
        el.style.setProperty("--fog", f.toFixed(3));
      }
    };

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "low-power" });
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    } catch {
      renderer = null; // no WebGL: plain page background, CSS effects still run
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2() },
        uT: { value: 0 },
        uA: { value: 0 },
        uP: { value: 0 },
        uDark: { value: 0 },
        uBg: { value: readBg() },
      },
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const smooth = { T: -1, A: 0, P: 0 };
    let visible = true;
    let raf = 0;
    let disposed = false;
    const start = performance.now();

    const resize = () => {
      if (!renderer) return;
      // render below device resolution: the image is soft by design and fbm is costly
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
      renderer.setPixelRatio(scale);
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      material.uniforms.uRes.value.copy(renderer.getDrawingBufferSize(new THREE.Vector2()));
    };

    const updateTheme = () => {
      material.uniforms.uDark.value = darkQuery.matches ? 1 : 0;
      material.uniforms.uBg.value = readBg();
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !renderer) return;
      const still = reduceMotion.matches;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const first = smooth.T < 0 || still;
      smooth.T = first ? T : smooth.T + (T - smooth.T) * 0.1;
      smooth.A = first ? A : smooth.A + (A - smooth.A) * 0.1;
      smooth.P = first ? P : smooth.P + (P - smooth.P) * 0.1;
      material.uniforms.uTime.value = still ? 8 : (now - start) / 1000;
      material.uniforms.uMouse.value.set(still ? 0 : mouse.x, still ? 0 : -mouse.y);
      material.uniforms.uT.value = smooth.T;
      material.uniforms.uA.value = smooth.A;
      material.uniforms.uP.value = smooth.P;
      renderer.render(scene, camera);
      if (visible && !still) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (renderer && !raf && !disposed) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      updateScroll();
      kick();
    };
    const onPointer = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTheme = () => {
      updateTheme();
      kick();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(wrap);
    const ro = new ResizeObserver(() => {
      resize();
      updateScroll();
      kick();
    });
    ro.observe(canvas);
    ro.observe(stage);

    resize();
    updateTheme();
    updateScroll();
    kick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    darkQuery.addEventListener("change", onTheme);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      darkQuery.removeEventListener("change", onTheme);
      quad.geometry.dispose();
      material.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div className="galaxy-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
