"use client";

import { useLocale as useNextIntlLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Locale = "ru" | "en";

/**
 * Хук для управления локалью без изменения URL
 * Сохраняет выбор в cookies для серверного рендеринга
 */
export function useLocale() {
  const currentLocale = useNextIntlLocale() as Locale;
  const router = useRouter();

  const setLocale = (newLocale: Locale) => {
    // Сохраняем в cookies для серверного рендеринга
    Cookies.set("NEXT_LOCALE", newLocale, { expires: 365 });
    
    // Перезагружаем страницу для применения новой локали
    router.refresh();
  };

  return {
    locale: currentLocale,
    setLocale,
  };
}
