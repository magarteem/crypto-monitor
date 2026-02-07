"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputFormField } from "@/app/shared/formFields/inputFormField/InputFormField";
import { Button } from "@ui/button";
import styles from "../passwordRecovery.module.scss";
import { useResetPassword } from "@/app/shared/api";
import { PageTitle } from "@/app/shared/components/pageTitle/PageTitle";
import { AuthFormLayout } from "@/app/shared/layouts/authFormLayout/AuthFormLayout";

// Schema валидации
const passwordRecoverySchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Некорректный email адрес"),
});

type PasswordRecoveryFormData = z.infer<typeof passwordRecoverySchema>;

export default function PasswordRecovery() {
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
  const { mutate: resetPassword, isPending } = useResetPassword();

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    setGlobalError("");
    setSuccessMessage("");

    resetPassword({
      data: { email: data.email },
    },
      {
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
      }
    );
  };

  return (
    <>
      {/* Header Section */}
      <PageTitle title="Восстановление пароля" subtitle="Введите email, указанный при регистрации" />

      {/*Recovery Card*/}
      <AuthFormLayout>
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
        </form>
      </AuthFormLayout>
    </>
  );
}
