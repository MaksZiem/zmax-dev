import { useMessages, useTranslations } from "next-intl";

type StatusKey = keyof ReturnType<typeof useMessages>["projects"]["status"];

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("projects.status");
  const known = useMessages().projects.status;
  const label = status in known ? t(status as StatusKey) : status;
  const live = status === "active";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-xs">
      <span className={live ? "h-1.5 w-1.5 rounded-full bg-accent" : "h-1.5 w-1.5 rounded-full bg-muted"} aria-hidden />
      {label}
    </span>
  );
}
