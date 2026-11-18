"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ProjectStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const heading = root.querySelector<HTMLElement>("[data-reveal-lines]");
    let io: IntersectionObserver | null = null;
    if (heading) {
      heading.classList.add("reveal-armed");
      io = new IntersectionObserver(
        ([entry]) => heading.classList.toggle("is-in", entry.isIntersecting),
        { threshold: 0.35 },
      );
      io.observe(heading);
    }

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-stack-card]"));
    const inners = cards.map((c) => c.querySelector<HTMLElement>(".stack-inner"));
    const last = cards.map(() => "");
    let raf = 0;
    const update = () => {
      raf = 0;
      const rects = cards.map((c) => c.getBoundingClientRect());
      for (let i = 0; i < cards.length; i++) {
        const inner = inners[i];
        if (!inner) continue;
        let p = 0;
        if (i + 1 < cards.length) {
          const r = rects[i];
          p = Math.min(1, Math.max(0, (r.bottom - rects[i + 1].top) / Math.max(1, r.height - 24)));
        }
        const v = p.toFixed(3);
        if (v !== last[i]) inner.style.setProperty("--stack", (last[i] = v));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
