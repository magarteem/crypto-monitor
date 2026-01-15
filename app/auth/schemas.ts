import { z } from "zod";

// Схема для входа
export const loginSchema = z.object({
  email: z.string().min(1, "Email обязателен").email(),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

// Схема для регистрации
export const registerSchema = z.object({
  email: z.string().min(1, "Email обязателен").email(),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .max(100, "Пароль слишком длинный"),
  confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
});
//.refine((data) => data.password === data.confirmPassword, {
//  message: "Пароли не совпадают",
//  path: ["confirmPassword"],
//});

// Типы для TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
