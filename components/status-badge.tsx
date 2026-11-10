import type { Dictionary } from "@/lib/i18n";

export function StatusBadge({ status, dict }: { status: string; dict: Dictionary }) {
  const label = dict.status[status as keyof Dictionary["status"]] ?? status;
  const live = status === "active";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-xs">
      <span className={live ? "h-1.5 w-1.5 rounded-full bg-accent" : "h-1.5 w-1.5 rounded-full bg-muted"} aria-hidden />
      {label}
    </span>
  );
}
