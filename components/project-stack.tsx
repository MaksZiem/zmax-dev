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
    let raf = 0;
    const update = () => {
      raf = 0;
      for (let i = 0; i < cards.length; i++) {
        const inner = cards[i].querySelector<HTMLElement>(".stack-inner");
        if (!inner) continue;
        const next = cards[i + 1];
        let p = 0;
        if (next) {
          const r = cards[i].getBoundingClientRect();
          const nextTop = next.getBoundingClientRect().top;
          // 0 when the next card reaches this card's bottom edge, 1 when it has fully covered it
          p = Math.min(1, Math.max(0, (r.top + r.height - nextTop) / Math.max(1, r.height - 24)));
        }
        inner.style.setProperty("--stack", p.toFixed(3));
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
