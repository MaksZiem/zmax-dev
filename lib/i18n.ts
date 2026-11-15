export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pl";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** One entry on the "About" timelines (education, experience). `school` is the institution or company. */
export type TimelineItem = { period: string; school: string; field: string; note: string | null; current: boolean };

const dictionaries = {
  pl: {
    role: "Full-Stack Developer",
    scroll: "Przewiń",
    about: "O mnie",
    educationTitle: "Wykształcenie",
    education: [
      {
        period: "2017 – 2021",
        school: "Technikum – ZSP nr 5 w Krośnie",
        field: "Kierunek: informatyka",
        note: null,
        current: false,
      },
      {
        period: "2021 – 2025",
        school: "Uniwersytet Rzeszowski",
        field: "Informatyka, specjalizacja: aplikacje internetowe",
        note: "Inżynier",
        current: false,
      },
      {
        period: "2026 – obecnie",
        school: "Politechnika Warszawska",
        field: "Informatyka, specjalizacja: inteligentne systemy",
        note: "W trakcie",
        current: true,
      },
    ] as TimelineItem[],
    experienceTitle: "Doświadczenie",
    experience: [
      {
        period: "sierpień 2024 – sierpień 2026",
        school: "e-bi sp. z o.o.",
        field: "Frontend Developer",
        note: null,
        current: false,
      },
    ] as TimelineItem[],
    workTitle: ["Wybrane projekty.", "Od schematu po produkcję."],
    allProjects: "Wszystkie projekty",
    home: "Strona główna",
    contact: "Kontakt",
    contactTitle: "Porozmawiajmy.",
    contactLead:
      "Masz projekt, pomysł na produkt albo ofertę pracy? Napisz – chętnie porozmawiam o tym, co mogę zbudować.",
    copy: "Kopiuj",
    copied: "Skopiowano",
    nameLabel: "Imię i nazwisko",
    locationLabel: "Lokalizacja",
    location: "Warszawa, Polska",
    elsewhere: "W sieci",
    terminal: {
      hint: "wpisz help albo cd frontend",
      help: "dostępne komendy:",
      notFound: "nie znaleziono komendy",
      opening: "otwieram",
      noRepo: "repozytorium nie jest publiczne",
    },
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
    educationTitle: "Education",
    education: [
      {
        period: "2017 – 2021",
        school: "Technical secondary school – ZSP no. 5, Krosno",
        field: "Computer Science",
        note: null,
        current: false,
      },
      {
        period: "2021 – 2025",
        school: "University of Rzeszów",
        field: "Computer Science, specialisation: web applications",
        note: "Engineer's degree (BEng)",
        current: false,
      },
      {
        period: "2026 – present",
        school: "Warsaw University of Technology",
        field: "Computer Science, specialisation: intelligent systems",
        note: "In progress",
        current: true,
      },
    ],
    experienceTitle: "Experience",
    experience: [
      {
        period: "August 2024 – August 2026",
        school: "e-bi sp. z o.o.",
        field: "Frontend Developer",
        note: null,
        current: false,
      },
    ],
    workTitle: ["Selected work.", "From schema to production."],
    allProjects: "All projects",
    home: "Home",
    contact: "Contact",
    contactTitle: "Let's talk.",
    contactLead: "Have a project, a product idea or a job offer? Get in touch – I'd be glad to talk about what I can build.",
    copy: "Copy",
    copied: "Copied",
    nameLabel: "Name",
    locationLabel: "Location",
    location: "Warsaw, Poland",
    elsewhere: "Elsewhere",
    terminal: {
      hint: "type help or cd frontend",
      help: "available commands:",
      notFound: "command not found",
      opening: "opening",
      noRepo: "the repository isn't public",
    },
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
