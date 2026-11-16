import type { Locale } from "./i18n/config";
import type messages from "./messages/pl.json";

// Typed translation keys: a typo in t("hero.rol") is a compile error.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
