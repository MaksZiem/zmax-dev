import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { HeroBackground } from "@/components/hero-background";
import { ProjectStack } from "@/components/project-stack";
import { ProjectStackCard } from "@/components/project-stack-card";
import { getDictionary, hasLocale, type TimelineItem } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";

// shown as the stacked showcase on the home page, in this order; all projects live on /projects
const FEATURED = ["ai-agents-platform", "ai-observability-incident-response", "ai-notes"];

const CONTACT = {
  email: "mtziembicki@gmail.com",
  linkedin: "https://www.linkedin.com/in/maksymilian-ziembicki-b81864351/",
  github: "https://github.com/MaksZiem",
};

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
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
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
                  <p className="font-mono text-base text-accent sm:text-lg">{dict.role}</p>
                  <h1 className="mt-4 text-6xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                    <span className="block">Maksymilian</span>
                    <span className="block">Ziembicki</span>
                  </h1>
                </div>
                <p className="max-w-md text-lg leading-relaxed text-muted md:pb-2">{dict.intro}</p>
              </div>
              <a
                href="#about"
                className="mt-14 inline-flex w-fit items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground"
              >
                <span className="scroll-cue-line" aria-hidden="true" />
                {dict.scroll}
              </a>
            </div>
          </section>
        </div>

        <section id="about" className="relative scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4 pb-40 pt-16 sm:px-6 md:pt-16">
            <h2 data-fog className="text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
              {dict.about}
            </h2>

            <div className="mt-10 grid gap-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-20">
              <div className="space-y-6 text-lg leading-relaxed text-muted">
                <p data-fog>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                  ex ea commodo consequat. Curabitur blandit tempus porttitor.
                </p>
                <p data-fog>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                  laborum. Maecenas faucibus mollis interdum.
                </p>
                <p data-fog>
                  Nullam quis risus eget urna mollis ornare vel eu leo. Cras mattis consectetur purus sit amet fermentum.
                  Vestibulum id ligula porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur. Donec
                  ullamcorper nulla non metus auctor fringilla.
                </p>
                <p data-fog>
                  Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Morbi leo risus, porta ac
                  consectetur ac, vestibulum at eros. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus,
                  tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
                </p>
              </div>

              {/* education + experience timelines */}
              <div className="space-y-8">
                <Timeline title={dict.educationTitle} items={dict.education} />
                <Timeline title={dict.experienceTitle} items={dict.experience} />
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
                      <span className="reveal-line-in">{dict.workTitle[0]}</span>
                    </span>
                    <span className="reveal-line">
                      <span className="reveal-line-in text-muted">{dict.workTitle[1]}</span>
                    </span>
                  </h2>
                </div>
                <p data-fog className="max-w-sm leading-relaxed text-muted">
                  {dict.projectsLead}
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
                    dict={dict}
                  />
                ))}
              </div>
            </ProjectStack>

            <div data-fog className="flex justify-center pb-32">
              <Link
                href={`/${lang}/projects`}
                className="group inline-flex items-center gap-4 rounded-full bg-foreground py-2 pl-7 pr-2 text-base font-semibold text-background shadow-[0_10px_40px_-12px_color-mix(in_srgb,var(--accent)_55%,transparent)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-12px_color-mix(in_srgb,var(--accent)_75%,transparent)]"
              >
                {dict.allProjects}
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
              {dict.contact}
            </p>
            <h2 data-fog className="mt-4 text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
              {dict.contactTitle}
            </h2>
            <p data-fog className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {dict.contactLead}
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
              <CopyButton value={CONTACT.email} label={dict.copy} doneLabel={dict.copied} />
            </div>

            <dl data-fog className="mt-20 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">{dict.nameLabel}</dt>
                <dd className="mt-3 text-lg font-medium">Maksymilian Ziembicki</dd>
                <dd className="mt-1 text-muted">{dict.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">{dict.locationLabel}</dt>
                <dd className="mt-3 text-lg font-medium">{dict.location}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted">{dict.elsewhere}</dt>
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
