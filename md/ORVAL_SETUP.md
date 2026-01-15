# Настройка Orval для генерации API клиента

## 📋 Что уже настроено

✅ Orval установлен  
✅ Конфигурация создана (`orval.config.ts`)  
✅ Axios instance настроен  
✅ React Query интеграция  
✅ Скрипты добавлены в package.json  

## 🚀 Использование

### 1. Убедитесь что backend запущен

Ваш backend должен быть доступен по адресу:
```
http://localhost:4000/api/docs-json
```

> **Примечание:** `/api/docs` - это Swagger UI (HTML), а `/api/docs-json` - это JSON спецификация OpenAPI.

### 2. Создайте .env.local

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Запустите генерацию API

```bash
# Одноразовая генерация
npm run api:generate

# Автоматическая генерация при изменениях
npm run api:watch
```

## 📁 Что будет сгенерировано

После выполнения `npm run api:generate`:

```
app/shared/api/generated/
├── api.ts        # Основные endpoint функции
├── schemas.ts    # TypeScript типы и схемы
└── (auth.ts, users.ts, etc.) # Разделение по тагам Swagger
```

## 💡 Пример использования

### С React Query hooks (автоматически):

```typescript
// В компоненте
import { useGetUsers, useCreateUser } from '@api/generated/api';

function UsersPage() {
  // GET запрос с автоматическим кэшированием
  const { data, isLoading, error } = useGetUsers();

  // POST запрос с мутацией
  const createUser = useCreateUser();

  const handleCreate = async () => {
    await createUser.mutateAsync({
      data: { name: "Ivan", email: "ivan@example.com" }
    });
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      {data?.map(user => <div key={user.id}>{user.name}</div>)}
      <button onClick={handleCreate}>Создать пользователя</button>
    </div>
  );
}
```

### С типами:

```typescript
import type { User, CreateUserDto } from '@api/generated/schemas';

const user: User = {
  id: 1,
  name: "Ivan",
  email: "ivan@example.com"
};

const createData: CreateUserDto = {
  name: "Ivan",
  email: "ivan@example.com",
  password: "secret123"
};
```

### Прямое использование функций:

```typescript
import { getUsers, createUser } from '@api/generated/api';

// В async функции
const users = await getUsers();
const newUser = await createUser({ name: "Ivan" });
```

## ⚙️ Конфигурация

### Текущие настройки (`orval.config.ts`):

- **Input**: `http://localhost:4000/api/docs` - Ваш Swagger
- **Output**: `app/shared/api/generated/` - Папка для генерации
- **Client**: `react-query` - Генерирует React hooks
- **Mode**: `tags-split` - Разделяет по тегам Swagger
- **Mutator**: Использует ваш axios instance с interceptors
- **StaleTime**: 10 секунд - время актуальности кэша

### Кастомизация:

Если нужно изменить настройки, отредактируйте `orval.config.ts`:

```typescript
// Изменить URL Swagger
input: {
  target: "http://your-backend-url/swagger.json",
},

// Изменить путь генерации
output: {
  target: "./src/api/generated",
},

// Добавить заголовки для fetch Swagger
input: {
  target: "http://localhost:4000/api/docs",
  headers: {
    Authorization: "Bearer your-token",
  },
},
```

## 🔄 Workflow разработки

### 1. Backend обновил API
Backend разработчик изменил эндпоинты или модели

### 2. Запустите генерацию
```bash
npm run api:generate
```

### 3. Используйте новые типы/хуки
TypeScript автоматически подхватит изменения

### 4. Режим watch (опционально)
```bash
# В отдельном терминале
npm run api:watch
```
Orval будет следить за изменениями и автоматически перегенерировать код

## 🛠️ Интеграция с текущим кодом

### Обновите существующие API запросы:

**Было:**
```typescript
const response = await fetch("http://localhost:3000/auth/register", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

**Стало:**
```typescript
import { useRegisterMutation } from '@api/generated/auth';

const registerMutation = useRegisterMutation();

await registerMutation.mutateAsync({
  data: { email, password, recaptchaToken }
});
```

## 🎯 Преимущества

✅ **TypeScript типизация** - автоматически из Swagger  
✅ **React Query hooks** - кэширование, рефетчинг  
✅ **Автокомплит** - IDE подсказки для всех endpoint  
✅ **Валидация** - проверка типов на этапе компиляции  
✅ **Синхронизация** - код всегда соответствует API  
✅ **Interceptors** - автоматическая авторизация  

## 🐛 Troubleshooting

### Ошибка: "Cannot fetch swagger"

```bash
# Проверьте доступность Swagger
curl http://localhost:4000/api/docs
```

Убедитесь что:
- Backend сервер запущен
- URL правильный
- Swagger доступен

### Ошибка генерации

```bash
# Очистите папку generated и попробуйте снова
rm -rf app/shared/api/generated/*
npm run api:generate
```

### Изменения в Swagger не применяются

```bash
# Очистите кэш Orval
rm -rf node_modules/.cache/orval
npm run api:generate
```

## 📚 Дополнительные ресурсы

- [Orval Documentation](https://orval.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)

## 🔥 Следующие шаги

1. Убедитесь что backend запущен на `http://localhost:4000`
2. Запустите `npm run api:generate`
3. Проверьте сгенерированные файлы в `app/shared/api/generated/`
4. Начните использовать хуки в компонентах!
