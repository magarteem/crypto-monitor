# Настройка Google ReCAPTCHA v2

## 📋 Шаги установки

### 1. Получение ключей ReCAPTCHA

1. Перейдите на [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Заполните форму:
   - **Label**: `Crypto Monitor` (или любое название)
   - **reCAPTCHA type**: Выберите **reCAPTCHA v2** > **"I'm not a robot" Checkbox**
   - **Domains**: 
     - `localhost` (для разработки)
     - Ваш домен (для production)
   - Примите условия использования
3. Нажмите **Submit**
4. Скопируйте полученные ключи:
   - **Site Key** (публичный ключ)
   - **Secret Key** (приватный ключ)

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3001

# Google OAuth (опционально)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ReCAPTCHA v2
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**⚠️ Важно:**
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - должен начинаться с `NEXT_PUBLIC_` для доступа на клиенте
- `RECAPTCHA_SECRET_KEY` - используется только на сервере, не должен быть публичным

### 3. Перезапуск сервера

После добавления переменных окружения перезапустите dev-сервер:

```bash
npm run dev
```

## ✅ Проверка работы

1. Откройте страницу `/auth`
2. Должен отображаться виджет ReCAPTCHA
3. Попробуйте залогиниться/зарегистрироваться
4. Кнопка отправки формы активируется только после прохождения ReCAPTCHA

## 🔧 Использование в коде

### Компонент ReCaptcha

```tsx
import { ReCaptcha } from "@features/recaptcha";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
const recaptchaRef = useRef<ReCAPTCHA>(null);

<ReCaptcha
  ref={recaptchaRef}
  onChange={(token) => setRecaptchaToken(token)}
  onExpired={() => setRecaptchaToken(null)}
/>
```

### Серверная валидация (на вашем Backend)

**Frontend отправляет токен:**
```tsx
const response = await fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: data.email,
    password: data.password,
    recaptchaToken // ← Токен ReCAPTCHA
  })
});
```

**Backend проверяет токен:**
```javascript
// Node.js/Express
const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
const verifyResponse = await fetch(verifyUrl, {
  method: 'POST',
  body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
});

const verifyData = await verifyResponse.json();
if (!verifyData.success) {
  return res.status(400).json({ error: 'ReCAPTCHA failed' });
}
```

## 🎨 Настройка темы

ReCAPTCHA автоматически использует тёмную тему (`theme="dark"`).

Для изменения темы отредактируйте файл `app/features/recaptcha/ReCaptcha.tsx`:

```tsx
<ReCAPTCHA
  theme="light" // или "dark"
  size="normal" // или "compact"
/>
```

## 🔒 Безопасность

✅ **Текущая реализация:**
- ReCAPTCHA на формах входа и регистрации
- Валидация токена на клиенте
- Автоматический сброс при ошибках
- Блокировка кнопки отправки без ReCAPTCHA

🔜 **Рекомендуется добавить:**
- Валидацию токена на вашем Backend сервере
- Rate limiting для предотвращения брутфорса
- Логирование неудачных попыток

## 🔗 Интеграция с внешним Backend

Если у вас отдельный backend:

1. **Frontend** получает токен от ReCAPTCHA
2. **Frontend** отправляет токен вместе с данными на backend
3. **Backend** валидирует токен через Google API
4. **Backend** возвращает результат

```typescript
// Frontend (Next.js)
const response = await fetch('YOUR_BACKEND_URL/auth/register', {
  body: JSON.stringify({
    ...formData,
    recaptchaToken // ← Добавляем токен
  })
});
```

```javascript
// Backend (ваш сервер)
// Проверяем токен через Google API
const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
const result = await fetch(verifyUrl, {
  method: 'POST',
  body: `secret=${SECRET_KEY}&response=${recaptchaToken}`
});
```

## 📚 Дополнительные ресурсы

- [Google reCAPTCHA v2 Documentation](https://developers.google.com/recaptcha/docs/display)
- [react-google-recaptcha NPM](https://www.npmjs.com/package/react-google-recaptcha)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🐛 Troubleshooting

### ReCAPTCHA не отображается

1. Проверьте наличие `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` в `.env.local`
2. Убедитесь что ключ начинается с `NEXT_PUBLIC_`
3. Перезапустите dev-сервер

### Ошибка "Invalid site key"

- Проверьте правильность Site Key
- Убедитесь что домен добавлен в Google Console
- Для localhost используйте `localhost`, а не `127.0.0.1`

### ReCAPTCHA не сбрасывается

Убедитесь что используете `ref` и вызываете `recaptchaRef.current?.reset()`
