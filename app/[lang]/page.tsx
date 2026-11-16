import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { HeroBackground } from "@/components/hero-background";
import { ProjectStack } from "@/components/project-stack";
import { ProjectStackCard } from "@/components/project-stack-card";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { getProjects } from "@/lib/projects";

// shown as the stacked showcase on the home page, in this order; all projects live on /projects
const FEATURED = ["ai-agents-platform", "ai-observability-incident-response", "ai-notes"];

const CONTACT = {
  email: "mtziembicki@gmail.com",
  linkedin: "https://www.linkedin.com/in/maksymilian-ziembicki-b81864351/",
  github: "https://github.com/MaksZiem",
};

type TimelineItem = {
  period: string;
  school: string;
  field: string;
  note: string;
  current: boolean;
};

type TimelineEntry = Omit<TimelineItem, "current">;

function toTimeline(entries: Record<string, TimelineEntry>, currentKey?: string): TimelineItem[] {
  return Object.entries(entries).map(([key, entry]) => ({ ...entry, current: key === currentKey }));
}

function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
  return (
    <div>
      <h3 data-fog className="font-mono text-xs uppercase tracking-widest text-accent">
        {title}
      </h3>
      <ol className="relative mt-5 border-l border-line">
        {items.map((item) => (
          <li key={item.period + item.school} data-fog className="relative pb-6 pl-6 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ${
                item.current
                  ? "bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_25%,transparent)]"
                  : "border border-line-strong bg-background"
              }`}
            />
            {/* period and badge share one line to keep each entry short */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-mono text-xs text-muted">{item.period}</span>
              {item.note && (
                <span
                  className={`rounded border px-1.5 font-mono text-[10px] leading-4 ${
                    item.current ? "border-accent/40 text-accent" : "border-line text-muted"
                  }`}
                >
                  {item.note}
                </span>
              )}
            </div>
            <p className="mt-1 text-lg font-semibold leading-snug tracking-tight">{item.school}</p>
            <p className="text-sm leading-relaxed text-muted">{item.field}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);
  const t = await getTranslations();
  const { about } = await getMessages();
  const education = toTimeline(about.education, "warsaw");
  const experience = toTimeline(about.experience);
  const projects = getProjects(lang);
  const featured = FEATURED.flatMap((slug) => projects.filter((p) => p.slug === slug));

  return (
    <>
      {/* one stage for hero + about: the galaxy canvas stays pinned behind both */}
      <div className="relative">
        <HeroBackground />

        {/* tall track: the hero stays pinned while the galaxy flows down into fog */}
        <div data-hero-track className="relative h-[140vh]">
          <section className="sticky top-14 h-[calc(100svh-3.5rem)]">
            <div className="hero-content mx-auto flex h-full max-w-6xl flex-col justify-center px-4 sm:px-6">
              {/* name on the left (one word per line), description on the right, aligned to the bottom line */}
              <div className="grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-end md:gap-14">
                <div>
                  <p className="font-mono text-base text-accent sm:text-lg">{t("hero.role")}</p>
                  <h1 className="mt-4 text-6xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                    <span className="block">Maksymilian</span>
                    <span className="block">Ziembicki</span>
                  </h1>
                </div>
                <p className="max-w-md text-lg leading-relaxed text-muted md:pb-2">{t("hero.intro")}</p>
              </div>
              <a
                href="#about"
                className="mt-14 inline-flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground"
              >
                <span className="scroll-cue-line" aria-hidden="true" />
                {t("hero.scroll")}
              </a>
            </div>
          </section>
        </div>

        <section id="about" className="relative scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4 pb-40 pt-16 sm:px-6 md:pt-16">
            <h2 data-fog className="text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
              {t("about.title")}
            </h2>

            <div className="mt-10 grid gap-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-20">
              <div className="space-y-6 text-lg leading-relaxed text-muted">
                <p data-fog>{t("about.paragraphs.p1")}</p>
                <p data-fog>{t("about.paragraphs.p2")}</p>
                <p data-fog>{t("about.paragraphs.p3")}</p>
                <p data-fog>{t("about.paragraphs.p4")}</p>
              </div>

              {/* education + experience timelines */}
              <div className="space-y-8">
                <Timeline title={t("about.educationTitle")} items={education} />
                <Timeline title={t("about.experienceTitle")} items={experience} />
              </div>
            </div>
          </div>
        </section>

        {/* featured projects: cards rise out of the smoke and stack on top of each other */}
        <section id="projects" className="relative scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24">
            <ProjectStack>
              <div className="flex flex-wrap items-end justify-between gap-8">
                <div>
                  <h2
                    data-reveal-lines
                    className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
                  >
                    <span className="reveal-line">
                      <span className="reveal-line-in">{t("work.titleFirst")}</span>
                    </span>
                    <span className="reveal-line">
                      <span className="reveal-line-in text-muted">{t("work.titleSecond")}</span>
                    </span>
                  </h2>
                </div>
                <p data-fog className="max-w-sm leading-relaxed text-muted">
                  {t("work.lead")}
                </p>
              </div>

              <div className="stack mt-16">
                {featured.map((project, i) => (
                  <ProjectStackCard
                    key={project.slug}
                    project={project}
                    index={i}
                    total={featured.length}
                    locale={lang}
                  />
                ))}
              </div>
            </ProjectStack>

            <div data-fog className="flex justify-center pb-32">
              <Link
                href={`/${lang}/projects`}
                className="group inline-flex items-center gap-4 rounded-full bg-foreground py-2 pl-7 pr-2 text-base font-semibold text-background shadow-[0_10px_40px_-12px_color-mix(in_srgb,var(--accent)_55%,transparent)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-12px_color-mix(in_srgb,var(--accent)_75%,transparent)]"
              >
                {t("work.allProjects")}
                <span className="font-mono text-sm font-normal opacity-60">({projects.length})</span>
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-full bg-accent text-lg text-background transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section id="contact" className="relative scroll-mt-14 border-t border-line">
          <div className="mx-auto max-w-6xl px-4 pb-28 pt-24 sm:px-6 md:pb-36 md:pt-32">
            <p data-fog className="font-mono text-base text-accent sm:text-lg">
              {t("contact.kicker")}
            </p>
            <h2 data-fog className="mt-4 text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
              {t("contact.title")}
            </h2>
            <p data-fog className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {t("contact.lead")}
            </p>

            <div data-fog className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={`mailto:${CONTACT.email}`}
                className="group inline-flex items-center gap-3 text-3xl font-medium tracking-tight sm:text-5xl"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                  {CONTACT.email}
                </span>
                <span aria-hidden="true" className="text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
              <CopyButton value={CONTACT.email} label={t("common.copy")} doneLabel={t("common.copied")} />
            </div>

            <dl data-fog className="mt-20 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">{t("contact.nameLabel")}</dt>
                <dd className="mt-3 text-lg font-medium">Maksymilian Ziembicki</dd>
                <dd className="mt-1 text-muted">{t("hero.role")}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">{t("contact.locationLabel")}</dt>
                <dd className="mt-3 text-lg font-medium">{t("contact.location")}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">{t("contact.elsewhere")}</dt>
                <dd className="mt-3 flex flex-col gap-2 text-lg font-medium">
                  <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="w-fit hover:text-accent">
                    LinkedIn ↗
                  </a>
                  <a href={CONTACT.github} target="_blank" rel="noreferrer" className="w-fit hover:text-accent">
                    GitHub ↗
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </>
  );
}
