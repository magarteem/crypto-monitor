# 🚀 Quick Start - Использование API

## ✅ Что настроено

- ✅ Orval установлен и настроен
- ✅ API клиент сгенерирован из `http://localhost:4000/api/docs-json`
- ✅ React Query hooks готовы к использованию
- ✅ TypeScript типы автоматически созданы
- ✅ Axios instance с автоматической авторизацией

---

## 📦 Сгенерированные модули

### Auth (Авторизация)
```typescript
import {
  useAuthControllerRegister,    // Регистрация
  useAuthControllerLogin,        // Вход
  useAuthControllerGoogleAuth,   // Google OAuth
  useAuthControllerTelegramAuth, // Telegram OAuth
} from "@api";
```

### Users (Пользователи)
```typescript
import {
  useUsersControllerFindAll,   // Получить всех
  useUsersControllerFindOne,   // Получить одного
  useUsersControllerUpdate,    // Обновить
  useUsersControllerRemove,    // Удалить
} from "@api";
```

### Password Recovery (Восстановление пароля)
```typescript
import {
  usePasswordRecoveryControllerRequestReset,  // Запросить сброс
  usePasswordRecoveryControllerResetPassword,  // Сбросить пароль
} from "@api";
```

### Типы
```typescript
import type {
  LoginDto,
  RegisterDto,
  UpdateUserDto,
  ResetPasswordDto,
  NewPasswordDto,
} from "@api";
```

---

## 🎯 Быстрый старт

### 1. Пример: Регистрация пользователя

```typescript
"use client";

import { useAuthControllerRegister } from "@api";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const registerMutation = useAuthControllerRegister();

  const handleSubmit = async (data: {
    name: string;
    email: string;
    password: string;
    passwordRepeat: string;
  }) => {
    try {
      await registerMutation.mutateAsync({ data });
      router.push("/dashboard");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <form onSubmit={(e) => { /* ... */ }}>
      {/* Ваши поля формы */}
      
      <button 
        type="submit" 
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Загрузка..." : "Зарегистрироваться"}
      </button>

      {registerMutation.isError && (
        <div>Ошибка: {registerMutation.error.message}</div>
      )}
    </form>
  );
}
```

### 2. Пример: Получение списка пользователей

```typescript
"use client";

import { useUsersControllerFindAll } from "@api";

export default function UsersPage() {
  const { data: users, isLoading, error } = useUsersControllerFindAll();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      <h1>Пользователи</h1>
      {users?.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
```

### 3. Пример: Обновление пользователя

```typescript
"use client";

import { useUsersControllerUpdate } from "@api";

export default function UserProfile({ userId }: { userId: string }) {
  const updateMutation = useUsersControllerUpdate();

  const handleUpdate = async (name: string) => {
    try {
      await updateMutation.mutateAsync({
        id: userId,
        data: { name },
      });
      alert("Профиль обновлен!");
    } catch (error) {
      alert("Ошибка обновления");
    }
  };

  return (
    <button onClick={() => handleUpdate("Новое имя")}>
      Обновить профиль
    </button>
  );
}
```

---

## 🔄 Обновление API

Когда backend изменился:

```bash
# 1. Запустите генерацию
npm run api:generate

# 2. TypeScript покажет где нужно обновить код
npx tsc --noEmit

# 3. Исправьте ошибки компиляции
```

### Режим watch (автоматическое обновление):

```bash
# В отдельном терминале
npm run api:watch
```

Orval будет автоматически перегенерировать код при изменении Swagger!

---

## 📁 Структура файлов

```
app/shared/api/
├── generated/                    # Сгенерированные файлы
│   ├── auth/
│   │   └── auth.ts              # Хуки авторизации
│   ├── users/
│   │   └── users.ts             # Хуки пользователей
│   ├── password-recovery/
│   │   └── password-recovery.ts # Хуки восстановления пароля
│   └── cryptoMonitorAPI.schemas.ts  # TypeScript типы
├── axios-instance.ts             # Кастомный axios
├── binance.ts                    # Binance API
├── hooks.ts                      # React Query хуки
└── index.ts                      # Экспорты
```

---

## ⚙️ Конфигурация

### Backend URL

В `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Orval конфиг

`orval.config.ts`:

```typescript
{
  input: {
    target: "http://localhost:4000/api/docs-json", // Swagger JSON
  },
  output: {
    target: "./app/shared/api/generated",
    client: "react-query",
    mode: "tags-split",
  },
}
```

---

## 🎨 Дополнительные фишки

### Отмена запросов

```typescript
const { refetch, cancel } = useUsersControllerFindAll();

// Отменить текущий запрос
cancel();
```

### Кастомные настройки React Query

```typescript
const { data } = useUsersControllerFindAll({
  query: {
    staleTime: 60000,          // Кэш 1 минута
    refetchInterval: 30000,     // Обновлять каждые 30 сек
    retry: 3,                   // Повторить 3 раза
    enabled: isLoggedIn,        // Условный запрос
  },
});
```

### Обработка ошибок

```typescript
try {
  await mutation.mutateAsync({ data });
} catch (error) {
  if (error.response?.status === 409) {
    alert("Пользователь уже существует");
  } else if (error.response?.status === 400) {
    alert("Неверные данные");
  } else {
    alert("Ошибка сервера");
  }
}
```

---

## 📚 Полезные ссылки

- [Подробная документация](./ORVAL_SETUP.md)
- [Примеры использования](./ORVAL_USAGE_EXAMPLE.md)
- [Orval Documentation](https://orval.dev/)
- [React Query](https://tanstack.com/query/latest)

---

## 🎉 Готово!

Теперь вы можете использовать типобезопасный API клиент с автоматическим кэшированием! 🚀
