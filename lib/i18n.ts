export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pl";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const dictionaries = {
  pl: {
    role: "Full-Stack Developer",
    scroll: "Przewiń",
    about: "O mnie",
    workTitle: ["Wybrane projekty.", "Od schematu po produkcję."],
    allProjects: "Wszystkie projekty",
    home: "Strona główna",
    intro:
      "Projektuję i buduję kompletne aplikacje webowe – od architektury backendu i bazy danych po dopracowany interfejs. Pracuję w TypeScripcie, NestJS i Next.js, a do produktów wdrażam AI, które działa przewidywalnie i bezpiecznie.",
    projects: "Projekty",
    projectsLead: "Każdy projekt ma opis architektury, przepływu danych, schemat bazy i przykładowy przebieg.",
    details: "Szczegóły",
    source: "Kod",
    demo: "Demo",
    back: "Wszystkie projekty",
    stack: "Stack",
    screenshots: "Zrzuty ekranu",
    contents: "Na tej stronie",
    role_label: "Rola",
    period_label: "Okres",
    expand: "Powiększ",
    close: "Zamknij",
    diagramError: "Nie udało się wyrenderować diagramu.",
    stackGroups: { frontend: "Frontend", backend: "Backend", database: "Baza danych", infra: "Infrastruktura", ai: "AI" },
    status: { active: "W rozwoju", completed: "Ukończony", mvp: "MVP", archived: "Archiwum" },
  },
  en: {
    role: "Full-Stack Developer",
    scroll: "Scroll",
    about: "About",
    workTitle: ["Selected work.", "From schema to production."],
    allProjects: "All projects",
    home: "Home",
    intro:
      "I design and build complete web applications – from backend architecture and the database to a polished interface. I work with TypeScript, NestJS and Next.js, and bring AI into products in a way that is predictable and safe.",
    projects: "Projects",
    projectsLead: "Every project comes with its architecture, data flow, database schema and an example run.",
    details: "Details",
    source: "Source",
    demo: "Demo",
    back: "All projects",
    stack: "Stack",
    screenshots: "Screenshots",
    contents: "On this page",
    role_label: "Role",
    period_label: "Period",
    expand: "Expand",
    close: "Close",
    diagramError: "Could not render the diagram.",
    stackGroups: { frontend: "Frontend", backend: "Backend", database: "Database", infra: "Infrastructure", ai: "AI" },
    status: { active: "In progress", completed: "Completed", mvp: "MVP", archived: "Archived" },
  },
};

export type Dictionary = (typeof dictionaries)["pl"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
