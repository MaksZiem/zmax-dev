import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/site-header";
import { isLocale, LOCALES } from "@/i18n/config";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = await getTranslations({ locale: lang });

  return {
    metadataBase: new URL("https://zmax-dev.pl"),
    title: { default: "Maksymilian Ziembicki", template: "%s · Maksymilian Ziembicki" },
    description: t("meta.description", { role: t("hero.role") }),
    alternates: { languages: { pl: "/pl", en: "/en" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <SiteHeader locale={lang} />
          <main className="flex-1">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:px-6">
            <span>© {new Date().getFullYear()} Maksymilian Ziembicki</span>
            <a href="https://github.com/MaksZiem" target="_blank" rel="noreferrer" className="hover:text-foreground">
              github.com/MaksZiem
            </a>
          </div>
        </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
