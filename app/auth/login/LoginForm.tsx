"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { InputFormField } from "@/app/shared/formFields/inputFormField/InputFormField";
import { Button } from "@ui/button";
import { loginSchema, type LoginFormData } from "../schemas";
import styles from "../page.module.css";
import { EyeClosedIcon, EyeOpenIcon } from "@/public/img";
import { RouteNames } from "@/app/shared/types";
import { axiosInstance } from "@/app/shared/api/axios-instance";

interface LoginFormProps {
  onError: (error: string) => void;
  globalError: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string | null;
    displayName: string | null;
    picture: string | null;
    role: string;
    method: string;
  };
  token: string;
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

  const onLoginSubmit = async (data: LoginFormData) => {
    onError("");
    setIsLoggingIn(true);

    try {
      // Получаем токен от API
      const response = await axiosInstance.post<AuthResponse>("/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token } = response.data;

      // Сохраняем токен в localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
      }

      // Авторизуем через next-auth
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        onError("Неверный email или пароль");
      } else {
        router.push(RouteNames.HOME);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Неверный email или пароль";
      onError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <form
      key="login-form"
      className={styles.form}
      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
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

      {globalError && (
        <div className={styles.errorMessage}>{globalError}</div>
      )}

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
