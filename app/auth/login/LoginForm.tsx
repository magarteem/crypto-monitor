"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { InputFormField } from "@/app/shared/formFields/inputFormField/InputFormField";
import { Button } from "@ui/button";
import { loginSchema, type LoginFormData } from "../schemas";
import styles from "../page.module.css";
import { EyeClosedIcon, EyeOpenIcon } from "@/public/img";
import { RouteNames } from "@/app/shared/types";

interface LoginFormProps {
  onError: (error: string) => void;
  globalError: string;
}

export function LoginForm({ onError, globalError }: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (
    data: LoginFormData,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    onError("");
    setIsLoggingIn(true);

    try {
      // Авторизуем через next-auth (запрос к API происходит в auth.config.ts)
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        onError("Неверный email или пароль");
      } else if (result?.ok) {
        // Получаем session и сохраняем токен в localStorage для axios interceptors
        const session = await getSession();
        if (session && (session as any).accessToken) {
          if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", (session as any).accessToken);
          }
        }
        router.push(RouteNames.HOME);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      onError("Ошибка при входе. Попробуйте еще раз.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <form
      key="login-form"
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        loginForm.handleSubmit(onLoginSubmit)(e);
      }}
    >
      <InputFormField
        form={loginForm}
        name="email"
        title="Почта"
        placeholder="ivan@example.com"
        type="email"
      />

      <InputFormField
        form={loginForm}
        name="password"
        title="Пароль"
        placeholder="Минимум 6 символов"
        type={showPassword ? "text" : "password"}
        rightElement={
          <button
            type="button"
            className={styles.forgotPassword}
            onClick={() => router.push(RouteNames.PASSWORD_RECOVERY)}
          >
            Забыли пароль?
          </button>
        }
        rightInputElement={
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>
        }
      />

      {globalError && <div className={styles.errorMessage}>{globalError}</div>}

      <Button
        type="submit"
        variant="primary"
        disabled={isLoggingIn}
        width="100%"
      >
        {isLoggingIn ? "Вход..." : "Войти"}
      </Button>
    </form>
  );
}
