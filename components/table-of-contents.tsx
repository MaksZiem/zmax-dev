"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string };

/**
 * "On this page" list for a project page. Highlights the section currently being read:
 * the last heading that has scrolled past a line just below the sticky header.
 */
export function TableOfContents({ items, label }: { items: Item[]; label: string }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const line = Math.min(160, window.innerHeight * 0.25); // just below the header
      let current = headings[0].id;
      for (const el of headings) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      // at the very bottom the last sections may never reach the line: mark the last one
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = headings[headings.length - 1].id;
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label={label} className="hidden lg:block">
      <div className="sticky top-24">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
        <ol className="space-y-2 border-l border-line text-sm">
          {items.map((item) => {
            const on = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={on ? "location" : undefined}
                  className={`-ml-px block border-l pl-3 transition-colors duration-200 ${
                    on
                      ? "border-accent font-medium text-foreground"
                      : "border-transparent text-muted hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
