// Shared header for pages that are still mocked: back link, title, lead and a "coming soon" badge.
import Link from "next/link";

export function ComingSoonHeader({
  homeHref,
  homeLabel,
  title,
  lead,
  badge,
}: {
  homeHref: string;
  homeLabel: string;
  title: string;
  lead: string;
  badge: string;
}) {
  return (
    <>
      <Link href={homeHref} className="text-sm text-muted hover:text-foreground">
        ← {homeLabel}
      </Link>
      <div className="mb-12 mt-8 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
          {badge}
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>
      </div>
    </>
  );
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block h-3 rounded bg-surface-strong ${className}`} />;
}
