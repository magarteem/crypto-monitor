"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputFormField } from "@/app/shared/formFields/inputFormField/InputFormField";
import { Button } from "@ui/button";
import { GoBack } from "@features/goBack";
import { RouteNames } from "@/app/shared/types";
import { usePasswordRecoveryControllerNewPassword } from "@/app/shared/api";
import { EyeClosedIcon, EyeOpenIcon } from "@/public/img";
import styles from "./page.module.css";

// Schema валидации для нового пароля
const newPasswordSchema = z
  .object({
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z
      .string()
      .min(6, "Пароль должен содержать минимум 6 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Проверяем наличие токена при загрузке
  useEffect(() => {
    if (!token) {
      setGlobalError("Токен восстановления пароля не найден");
    }
  }, [token]);

  // Используем сгенерированный хук для установки нового пароля
  const { mutate: setNewPassword, isPending } =
    usePasswordRecoveryControllerNewPassword({
      mutation: {
        onSuccess: () => {
          setSuccessMessage(
            "Пароль успешно изменен! Перенаправление на страницу входа..."
          );
          setGlobalError("");
          form.reset();

          // Редирект на страницу входа через 2 секунды
          setTimeout(() => {
            router.push(RouteNames.HOME);
          }, 2000);
        },
        onError: (error: any) => {
          console.error("Set new password error:", error);
          setGlobalError(
            error?.response?.data?.message ||
              "Ошибка установки нового пароля. Возможно, токен недействителен или истёк."
          );
          setSuccessMessage("");
        },
      },
    });

  const onSubmit = async (data: NewPasswordFormData) => {
    if (!token) {
      setGlobalError("Токен восстановления пароля не найден");
      return;
    }

    setGlobalError("");
    setSuccessMessage("");

    setNewPassword({
      token,
      data: {
        password: data.password,
        passwordRepeat: data.confirmPassword,
      },
    });
  };

  return (
    <div className={styles.page}>
      <GoBack />
      <main className={styles.main}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Новый пароль</h1>
          <p className={styles.subtitle}>
            Введите новый пароль для вашего аккаунта
          </p>
        </div>

        {/* New Password Card */}
        <div className={styles.card}>
          <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
            <InputFormField
              form={form}
              name="password"
              title="Новый пароль"
              placeholder="Минимум 6 символов"
              type={showPassword ? "text" : "password"}
              rightInputElement={
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              }
            />

            <InputFormField
              form={form}
              name="confirmPassword"
              title="Подтвердите пароль"
              placeholder="Повторите новый пароль"
              type={showConfirmPassword ? "text" : "password"}
              rightInputElement={
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                >
                  {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              }
            />

            {globalError && (
              <div className={styles.errorMessage}>{globalError}</div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isPending || !token}
              width="100%"
            >
              {isPending ? "Сохранение..." : "Сохранить новый пароль"}
            </Button>

            <button
              type="button"
              className={styles.backToLogin}
              onClick={() => router.push(RouteNames.HOME)}
            >
              Вернуться к входу
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function NewPassword() {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <GoBack />
          <main className={styles.main}>
            <div className={styles.header}>
              <h1 className={styles.title}>Загрузка...</h1>
            </div>
          </main>
        </div>
      }
    >
      <NewPasswordForm />
    </Suspense>
  );
}
