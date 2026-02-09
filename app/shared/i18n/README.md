# Internationalization с next-intl

Профессиональная система интернационализации с использованием библиотеки **next-intl**.

## 📦 Установка

```bash
npm install next-intl
```

## 📁 Структура

```
app/shared/i18n/
├── dictionaries/          # JSON файлы с переводами
│   ├── en.json           # Английский
│   └── ru.json           # Русский
├── routing.ts            # Конфигурация маршрутизации
├── request.ts            # Серверная загрузка сообщений
├── types.ts              # TypeScript типы
└── index.ts              # Публичный API

middleware.ts             # Middleware для i18n роутинга
next.config.ts            # Конфигурация next-intl плагина
```

## ⚙️ Конфигурация

### 1. next.config.ts

```ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
```

### 2. routing.ts

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "ru",
});
```

### 3. middleware.ts

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./app/shared/i18n/routing";

export default createMiddleware(routing);
```

### 4. app/layout.tsx

```tsx
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## 🚀 Использование

### В клиентских компонентах

```tsx
"use client";

import { useTranslations, useLocale } from "next-intl";

export function MyComponent() {
  const t = useTranslations("settings");
  const locale = useLocale();

  return (
    <div>
      {/* Простой перевод */}
      <h1>{t("title")}</h1>

      {/* Перевод с параметрами */}
      <p>{t("coins.tariffWarning", { count: "3" })}</p>

      {/* Текущий язык */}
      <span>Current: {locale}</span>
    </div>
  );
}
```

### Смена языка

```tsx
const handleLocaleChange = (newLocale: "ru" | "en") => {
  // Перезагружаем страницу с новой локалью
  window.location.href = `/${newLocale}${window.location.pathname}`;
};
```

### В серверных компонентах

```tsx
import { getTranslations } from "next-intl/server";

export default async function ServerComponent() {
  const t = await getTranslations("settings");

  return <h1>{t("title")}</h1>;
}
```

## 📝 Структура переводов

JSON файлы имеют вложенную структуру:

```json
{
  "settings": {
    "title": "Настройки",
    "notifications": {
      "title": "Уведомления",
      "telegram": "Telegram Bot"
    }
  }
}
```

Доступ к переводам:

```tsx
const t = useTranslations("settings");

t("title"); // "Настройки"
t("notifications.title"); // "Уведомления"
t("notifications.telegram"); // "Telegram Bot"
```

## 🔄 Интерполяция

### Простые параметры

```json
{
  "greeting": "Привет, {name}!"
}
```

```tsx
t("greeting", { name: "Иван" }); // "Привет, Иван!"
```

### Множественное число (ICU)

```json
{
  "messages": "{count, plural, =0{Нет сообщений} one{# сообщение} few{# сообщения} other{# сообщений}}"
}
```

```tsx
t("messages", { count: 0 }); // "Нет сообщений"
t("messages", { count: 1 }); // "1 сообщение"
t("messages", { count: 5 }); // "5 сообщений"
```

## 🌐 URL Structure

### as-needed (используется в проекте)

```
/ → русский (дефолтный)
/en → английский
```

### always

```
/ru → русский
/en → английский
```

Настройка в `routing.ts`:

```ts
localePrefix: "as-needed"; // или 'always'
```

## 🎨 Особенности next-intl

### ✅ Преимущества

- **ICU Message Format** - продвинутая интерполяция
- **Type Safety** - полная типизация из коробки
- **Server Components** - работает с RSC
- **Namespace** - организация переводов
- **Форматирование** - даты, числа, валюты
- **Плюрализация** - автоматическая для всех языков

### 📊 Производительность

- Размер: ~50KB (gzip ~15KB)
- Tree-shaking: ✅
- Code splitting: ✅ (по локалям)
- SSR: ✅
- RSC: ✅

## 🔧 Продвинутые фичи

### Форматирование дат и чисел

```tsx
import { useFormatter } from "next-intl";

function Component() {
  const format = useFormatter();

  const date = format.dateTime(new Date(), {
    dateStyle: "long",
  });

  const price = format.number(2999.5, {
    style: "currency",
    currency: "RUB",
  });

  return (
    <>
      <p>{date}</p> {/* "9 февраля 2026 г." */}
      <p>{price}</p> {/* "2 999,50 ₽" */}
    </>
  );
}
```

### Rich Text

```json
{
  "welcome": "Добро пожаловать, <bold>{name}</bold>!"
}
```

```tsx
t.rich("welcome", {
  name: "Иван",
  bold: (chunks) => <strong>{chunks}</strong>,
});
```

## 📚 Документация

- [next-intl docs](https://next-intl-docs.vercel.app/)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

## 🆚 Сравнение

| Библиотека | Размер | ICU | RSC | Type Safety |
|------------|--------|-----|-----|-------------|
| next-intl | 50KB | ✅ | ✅ | ✅ |
| react-i18next | 80KB | ❌ | ⚠️ | ⚠️ |
| Custom | 2KB | ❌ | ✅ | ⚠️ |

**Вывод**: next-intl - лучший выбор для Next.js 13+ с App Router.
