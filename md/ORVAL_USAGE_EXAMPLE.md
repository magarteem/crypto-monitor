# Примеры использования сгенерированного API

## 🎯 Что было сгенерировано

После выполнения `npm run api:generate` получены:

### Хуки для Authentication:
- `useAuthControllerRegister()` - регистрация
- `useAuthControllerLogin()` - вход в систему
- `useAuthControllerGoogleAuth()` - OAuth через Google
- `useAuthControllerTelegramAuth()` - OAuth через Telegram

### Хуки для Users:
- `useUsersControllerFindAll()` - получить всех пользователей
- `useUsersControllerFindOne()` - получить одного пользователя
- `useUsersControllerUpdate()` - обновить пользователя
- `useUsersControllerRemove()` - удалить пользователя

### TypeScript типы:
- `LoginDto` - тип для логина
- `RegisterDto` - тип для регистрации
- `UpdateUserDto` - тип для обновления пользователя
- И другие...

---

## 📝 Пример 1: Обновить страницу auth

Заменим текущий fetch на сгенерированные хуки.

### Было (старый код с fetch):

\`\`\`typescript
const onRegisterSubmit = async (data: RegisterFormData) => {
  try {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        recaptchaToken,
      }),
    });
    // ...
  } catch (error) {
    setGlobalError("Ошибка регистрации");
  }
};
\`\`\`

### Стало (с Orval + React Query):

\`\`\`typescript
// В начале компонента
import { 
  useAuthControllerRegister, 
  useAuthControllerLogin,
  type RegisterDto,
  type LoginDto 
} from "@api";

export default function AuthPage() {
  // Используем сгенерированные хуки
  const registerMutation = useAuthControllerRegister();
  const loginMutation = useAuthControllerLogin();

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setGlobalError("");
    
    if (!recaptchaToken) {
      setGlobalError("Подтвердите что вы не робот");
      return;
    }

    try {
      // Используем типизированную мутацию
      await registerMutation.mutateAsync({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          passwordRepeat: data.passwordRepeat,
        },
      });

      // После успешной регистрации - автоматический вход
      router.push("/dashboard");
    } catch (error) {
      setGlobalError("Ошибка регистрации");
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setGlobalError("");
    
    if (!recaptchaToken) {
      setGlobalError("Подтвердите что вы не робот");
      return;
    }

    try {
      // Используем типизированную мутацию
      await loginMutation.mutateAsync({
        data: {
          email: data.email,
          password: data.password,
        },
      });

      router.push("/dashboard");
    } catch (error) {
      setGlobalError("Неверный email или пароль");
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  return (
    // JSX...
    <Button
      type="submit"
      disabled={registerMutation.isPending || !recaptchaToken}
    >
      {registerMutation.isPending ? "Регистрация..." : "Зарегистрироваться"}
    </Button>
  );
}
\`\`\`

---

## 📝 Пример 2: Получение списка пользователей

\`\`\`typescript
import { useUsersControllerFindAll } from "@api";

function UsersPage() {
  // Автоматический fetch + кэширование + рефетч
  const { data: users, isLoading, error, refetch } = useUsersControllerFindAll();

  if (isLoading) return <div>Загрузка пользователей...</div>;
  
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()}>Обновить</button>
      {users?.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
\`\`\`

---

## 📝 Пример 3: Обновление пользователя

\`\`\`typescript
import { useUsersControllerUpdate, type UpdateUserDto } from "@api";

function UserProfile({ userId }: { userId: string }) {
  const updateUser = useUsersControllerUpdate();

  const handleUpdate = async (newData: UpdateUserDto) => {
    try {
      await updateUser.mutateAsync({
        id: userId,
        data: newData,
      });
      
      alert("Профиль обновлен!");
    } catch (error) {
      alert("Ошибка обновления");
    }
  };

  return (
    <button 
      onClick={() => handleUpdate({ name: "Новое имя" })}
      disabled={updateUser.isPending}
    >
      {updateUser.isPending ? "Сохранение..." : "Обновить профиль"}
    </button>
  );
}
\`\`\`

---

## 📝 Пример 4: Прямой вызов без хуков

Если нужно вызвать API без React Query (например, в utils функции):

\`\`\`typescript
import { authControllerLogin, authControllerRegister } from "@api/generated/auth/auth";

async function loginUser(email: string, password: string) {
  try {
    const response = await authControllerLogin({
      email,
      password,
    });
    
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
\`\`\`

---

## 📝 Пример 5: Кастомные настройки React Query

\`\`\`typescript
import { useUsersControllerFindAll } from "@api";

function UsersPage() {
  const { data } = useUsersControllerFindAll({
    query: {
      // Кастомные настройки React Query
      staleTime: 60000, // 1 минута
      refetchInterval: 30000, // Рефетч каждые 30 секунд
      refetchOnWindowFocus: true,
      retry: 3,
      onSuccess: (data) => {
        console.log("Users loaded:", data);
      },
      onError: (error) => {
        console.error("Error loading users:", error);
      },
    },
  });

  return <div>{/* ... */}</div>;
}
\`\`\`

---

## 📝 Пример 6: Оптимистичные обновления

\`\`\`typescript
import { useUsersControllerUpdate, useUsersControllerFindAll } from "@api";
import { useQueryClient } from "@tanstack/react-query";

function UserProfile() {
  const queryClient = useQueryClient();
  const updateUser = useUsersControllerUpdate();

  const handleUpdate = async (userId: string, newName: string) => {
    // Оптимистичное обновление UI до получения ответа от сервера
    await updateUser.mutateAsync(
      {
        id: userId,
        data: { name: newName },
      },
      {
        onSuccess: () => {
          // Инвалидируем кэш users после успешного обновления
          queryClient.invalidateQueries({ queryKey: ['usersControllerFindAll'] });
        },
      }
    );
  };

  return <div>{/* ... */}</div>;
}
\`\`\`

---

## 🎯 Преимущества использования

### ✅ Типобезопасность
TypeScript проверяет типы на этапе компиляции:

\`\`\`typescript
// ❌ Ошибка: свойство 'invalidField' не существует
registerMutation.mutateAsync({
  data: {
    name: "Ivan",
    email: "ivan@test.com",
    invalidField: "test", // TypeScript error!
  },
});

// ✅ Правильно
registerMutation.mutateAsync({
  data: {
    name: "Ivan",
    email: "ivan@test.com",
    password: "123456",
    passwordRepeat: "123456",
  },
});
\`\`\`

### ✅ Автокомплит в IDE

IDE подсказывает все доступные поля:

\`\`\`typescript
registerMutation.mutateAsync({
  data: {
    name: "Ivan",
    email: "ivan@test.com",
    pass // IDE автоматически предложит: password, passwordRepeat
  },
});
\`\`\`

### ✅ Автоматическое кэширование

React Query автоматически кэширует данные:

\`\`\`typescript
// Первый вызов - запрос к серверу
const { data: users1 } = useUsersControllerFindAll();

// Второй вызов в другом компоненте - данные из кэша (без запроса!)
const { data: users2 } = useUsersControllerFindAll();
\`\`\`

### ✅ Автоматические повторные попытки

React Query автоматически повторяет неудачные запросы:

\`\`\`typescript
const { data, isError, error } = useUsersControllerFindAll({
  query: {
    retry: 3, // Повторить 3 раза при ошибке
    retryDelay: 1000, // Задержка 1 секунда между попытками
  },
});
\`\`\`

---

## 🔄 Обновление API

Когда backend изменится:

1. Backend обновил Swagger
2. Запустите: `npm run api:generate`
3. TypeScript сразу покажет ошибки в местах, где используются старые типы
4. Обновите код согласно новым типам

---

## 🎨 Дополнительные фишки

### Отмена запросов

\`\`\`typescript
const { data, refetch } = useUsersControllerFindAll();

// Отменить текущий запрос
queryClient.cancelQueries({ queryKey: ['usersControllerFindAll'] });
\`\`\`

### Загрузка и ошибки

\`\`\`typescript
const mutation = useAuthControllerRegister();

return (
  <>
    {mutation.isPending && <Spinner />}
    {mutation.isError && <Error message={mutation.error.message} />}
    {mutation.isSuccess && <Success />}
  </>
);
\`\`\`

### Мультиязычные ошибки

\`\`\`typescript
try {
  await registerMutation.mutateAsync({ data });
} catch (error) {
  if (error.response?.status === 409) {
    setError("Пользователь уже существует");
  } else if (error.response?.status === 400) {
    setError("Неверные данные");
  } else {
    setError("Ошибка сервера");
  }
}
\`\`\`

---

Готово! Теперь ваш код типобезопасный, читаемый и легко поддерживаемый! 🚀
