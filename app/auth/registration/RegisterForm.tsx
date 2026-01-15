"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import ReCAPTCHA from "react-google-recaptcha";
import { InputFormField } from "@/app/shared/formFields/inputFormField/InputFormField";
import { Button } from "@ui/button";
import { ReCaptcha } from "@features/recaptcha";
import { registerSchema, type RegisterFormData } from "../schemas";
import styles from "../page.module.css";
import { EyeClosedIcon, EyeOpenIcon } from "@/public/img";
import { axiosInstance } from "@/app/shared/api/axios-instance";
import { RouteNames } from "@/app/shared/types";

interface RegisterFormProps {
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

export function RegisterForm({ onError, globalError }: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegisterSubmit = async (data: RegisterFormData) => {
    onError("");

    if (!recaptchaToken) {
      onError("Пожалуйста, подтвердите что вы не робот");
      return;
    }

    if (data.password !== data.confirmPassword) {
      onError("Пароли не совпадают");
      return;
    }

    setIsSubmitting(true);

    try {
      // Используем axios напрямую для получения ответа с user и token
      const response = await axiosInstance.post<AuthResponse>("/api/auth/register", {
        email: data.email,
        password: data.password,
        displayName: data.email.split("@")[0], // Используем часть email как имя
      });

      const { token } = response.data;

      // Сохраняем токен
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
        onError("Ошибка авторизации после регистрации");
      } else {
        router.push(RouteNames.HOME);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Ошибка регистрации";
      onError(errorMessage);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      key="register-form"
      className={styles.form}
      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
    >
      <InputFormField
        form={registerForm}
        name="email"
        title="Почта"
        placeholder="ivan@example.com"
        type="email"
      />

      <InputFormField
        form={registerForm}
        name="password"
        title="Пароль"
        placeholder="Минимум 6 символов"
        type={showPassword ? "text" : "password"}
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

      <InputFormField
        form={registerForm}
        name="confirmPassword"
        title="Подтвердите пароль"
        placeholder="Повторите пароль"
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

      <ReCaptcha
        ref={recaptchaRef}
        onChange={(token) => setRecaptchaToken(token)}
        onExpired={() => setRecaptchaToken(null)}
        theme="dark"
      />

      {globalError && <div className={styles.errorMessage}>{globalError}</div>}

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || !recaptchaToken}
        width="100%"
      >
        {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
      </Button>
    </form>
  );
}
