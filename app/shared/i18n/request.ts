import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // Валидация: если локаль не поддерживается, показываем 404
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return {
    locale: locale as string,
    messages: (await import(`./dictionaries/${locale}.json`)).default,
  };
});
