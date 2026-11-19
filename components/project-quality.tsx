import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Quality } from "@/lib/projects";

export function ProjectQuality({ quality }: { quality: Quality }) {
  const t = useTranslations("projects.quality");

  return (
    <section aria-label={t("title")} className="mb-14 mt-8 max-w-[72ch] text-base">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-8">
        <div className="flex flex-col rounded-xl border border-line bg-surface/40 p-6">
          <p className="flex items-baseline gap-3">
            <span className="text-6xl font-semibold tracking-tight text-accent tabular-nums">{quality.tests}</span>
            <span className="text-lg text-muted">{t("count", { count: quality.tests })}</span>
          </p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {quality.kinds.map((kind) => (
              <li
                key={kind}
                className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent"
              >
                {t(`kinds.${kind}`)}
              </li>
            ))}
            {quality.framework && (
              <li className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                {quality.framework}
              </li>
            )}
          </ul>

          {quality.ci && (
            <div className="mt-6 border-t border-line pt-5">
              <a
                href={quality.ci}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 text-sm font-medium"
              >
                {quality.ciBadge && (
                  <Image
                    src={quality.ciBadge}
                    alt={t("ciStatus")}
                    width={0}
                    height={0}
                    unoptimized
                    className="h-5 w-auto"
                  />
                )}
                <span className="text-muted transition-colors group-hover:text-foreground">{t("ciLink")} ↗</span>
              </a>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t("ci")}</p>
            </div>
          )}
        </div>

        {quality.covered.length > 0 && (
          <div>
            <h3 className="mb-4 text-sm font-medium">{t("covered")}</h3>
            <ul className="space-y-3">
              {quality.covered.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent"
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function TestsChip({ tests, className = "" }: { tests: number; className?: string }) {
  const t = useTranslations("projects.quality");

  return (
    <li
      className={`inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent ${className}`}
    >
      <span aria-hidden="true">✓</span>
      {tests} {t("count", { count: tests })}
    </li>
  );
}
