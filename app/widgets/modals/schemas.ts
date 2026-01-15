import { z } from "zod";

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Имя обязательно")
    .max(50, "Имя должно содержать не более 50 символов")
    .trim(),
  avatar: z
    .union([
      z.instanceof(File).refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "Размер файла не должен превышать 5MB"
      ).refine(
        (file) => file.type.startsWith("image/"),
        "Файл должен быть изображением"
      ),
      z.undefined(),
    ])
    .optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

export const feedbackSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Некорректный email адрес")
    .trim(),
  message: z
    .string()
    .min(10, "Сообщение должно содержать минимум 10 символов")
    .max(2000, "Сообщение должно содержать не более 2000 символов")
    .trim(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;
