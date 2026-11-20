"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type CSSProperties } from "react";
import { publicPathname } from "@/lib/site";

export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

interface SiteNavProps {
  items: NavItem[];
  labels: { main: string; open: string; close: string };
  children?: React.ReactNode;
}

// Section links ("/#about") are never "current"; page links match their path and anything below it.
function isCurrent(pathname: string, item: NavItem) {
  if (item.external || item.href.includes("#")) return false;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavAnchor({
  item,
  current,
  className,
  style,
  onNavigate,
}: {
  item: NavItem;
  current: boolean;
  className: string;
  style?: CSSProperties;
  onNavigate?: () => void;
}) {
  const content = (
    <>
      <span>{item.label}</span>
      {item.external && (
        <span aria-hidden="true" className="nav-arrow">
          ↗
        </span>
      )}
    </>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className} style={style} onClick={onNavigate}>
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={className}
      style={style}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}

export function SiteNav({ items, labels, children }: SiteNavProps) {
  const pathname = publicPathname(usePathname());
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <div className="flex items-center gap-3 md:gap-6">
        <nav aria-label={labels.main} className="hidden items-center gap-5 md:flex lg:gap-6">
          {items.map((item) => (
            <NavAnchor key={item.href} item={item} current={isCurrent(pathname, item)} className="nav-link" />
          ))}
        </nav>

        {children}

        <button
          type="button"
          className="nav-burger md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? labels.close : labels.open}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div id={panelId} className="nav-panel md:hidden" data-open={open} inert={!open}>
        <div className="nav-panel-inner">
          <nav aria-label={labels.main} className="mx-auto flex max-w-6xl flex-col px-4 pb-6 pt-2 sm:px-6">
            {items.map((item, index) => (
              <NavAnchor
                key={item.href}
                item={item}
                current={isCurrent(pathname, item)}
                className="nav-panel-link"
                style={{ "--i": index } as CSSProperties}
                onNavigate={close}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
