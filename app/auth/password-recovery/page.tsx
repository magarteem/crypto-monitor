"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputFormField } from "@/app/shared/formFields/inputFormField/InputFormField";
import { Button } from "@ui/button";
import { GoBack } from "@features/goBack";
import { RouteNames } from "@/app/shared/types";
import { usePasswordRecoveryControllerResetPassword } from "@/app/shared/api";
import styles from "./page.module.css";

// Schema валидации
const passwordRecoverySchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Некорректный email адрес"),
});

type PasswordRecoveryFormData = z.infer<typeof passwordRecoverySchema>;

export default function PasswordRecovery() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<PasswordRecoveryFormData>({
    resolver: zodResolver(passwordRecoverySchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  // Используем сгенерированный хук для восстановления пароля
  const { mutate: resetPassword, isPending } =
    usePasswordRecoveryControllerResetPassword({
      mutation: {
        onSuccess: () => {
          setSuccessMessage(
            "Письмо с инструкциями по восстановлению пароля отправлено на ваш email"
          );
          setGlobalError("");
          form.reset();
        },
        onError: (error: any) => {
          console.error("Password recovery error:", error);
          setGlobalError(
            error?.response?.data?.message ||
              "Ошибка отправки письма восстановления"
          );
          setSuccessMessage("");
        },
      },
    });

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    setGlobalError("");
    setSuccessMessage("");

    resetPassword({
      data: { email: data.email },
    });
  };

  return (
    <div className={styles.page}>
      <GoBack />
      <main className={styles.main}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Восстановление пароля</h1>
          <p className={styles.subtitle}>
            Введите email, указанный при регистрации
          </p>
        </div>

        {/* Recovery Card */}
        <div className={styles.card}>
          <form className={styles.form} onSubmit={form.handleSubmit(onSubmit)}>
            <InputFormField
              form={form}
              name="email"
              title="Email"
              placeholder="ivan@example.com"
              type="email"
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
              disabled={isPending}
              width="100%"
            >
              {isPending ? "Отправка..." : "Отправить письмо"}
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
