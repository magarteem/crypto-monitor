import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Поддерживаемые локали
  locales: ["en", "ru"],

  // Локаль по умолчанию
  defaultLocale: "ru",

  // Не добавляем префикс локали в URL (работает без [locale] папки)
  localePrefix: "never" as any,
});

// Типы
export type Locale = (typeof routing.locales)[number];
