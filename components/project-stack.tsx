"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll behaviour for the featured-projects showcase:
 * - the [data-reveal-lines] heading slides its lines up from a mask when it comes into view,
 * - [data-stack-card] cards are sticky; while the next card slides over one, that card
 *   shrinks, dims and blurs (CSS reads --stack, 0..1, set here).
 * Cards emerging from the smoke is handled by the shared [data-fog] logic in HeroBackground.
 */
export function ProjectStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // ---- heading line reveal (only armed once JS runs, so no-JS users still see it)
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

    // ---- stacking cards
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-stack-card]"));
    const inners = cards.map((c) => c.querySelector<HTMLElement>(".stack-inner"));
    const last = cards.map(() => "");
    let raf = 0;
    const update = () => {
      raf = 0;
      // read all rects first, then write (no forced layouts in between)
      const rects = cards.map((c) => c.getBoundingClientRect());
      for (let i = 0; i < cards.length; i++) {
        const inner = inners[i];
        if (!inner) continue;
        let p = 0;
        if (i + 1 < cards.length) {
          const r = rects[i];
          // 0 when the next card reaches this card's bottom edge, 1 when it has fully covered it
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
