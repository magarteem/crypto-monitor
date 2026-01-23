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

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");
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
    setGlobalError("");

    if (!recaptchaToken) {
      setGlobalError("Пожалуйста, подтвердите что вы не робот");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setGlobalError("Пароли не совпадают");
      return;
    }

    setIsSubmitting(true);

    try {
      // Используем axios напрямую для получения ответа с user и token
      await axiosInstance.post<AuthResponse>(
        "/api/auth/register",
        {
          email: data.email,
          password: data.password,
        }
      );

      // Авторизуем через next-auth (токен будет сохранен в session)
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setGlobalError("Ошибка авторизации после регистрации");
      } else {
        //router.push(RouteNames.TARIFFS);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Ошибка регистрации";
      setGlobalError(errorMessage);
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

      <div className={styles.registerLink}>
        <span>Уже зарегистрированы? </span>
        <button
          type="button"
          className={styles.registerButton}
          onClick={() => router.push(RouteNames.AUTH + "/login")}
        >
          Войти
        </button>
      </div>
    </form>
  );
}
