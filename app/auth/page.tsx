"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@ui/button";
import { GoBack } from "@features/goBack";
import { OAuthButtons } from "@features/oauthButtons";
import { LoginForm } from "./login/LoginForm";
import { RegisterForm } from "./registration/RegisterForm";
import styles from "./page.module.css";
import { RouteNames } from "../shared/types";
export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [globalError, setGlobalError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Параллакс эффект
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  // Сброс ошибок при переключении вкладок
  useEffect(() => {
    setGlobalError("");
  }, [activeTab]);

  // Редирект на главную, если пользователь уже авторизован
  useEffect(() => {
    if (status === "authenticated") {
      router.push(RouteNames.HOME);
    }
  }, [status, router]);

  // Показываем загрузку, пока проверяется сессия
  if (status === "loading" || status === "authenticated") {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>Загрузка...</h1>
          </div>
        </main>
      </div>
    );
  }

  const handleGoogleAuth = async () => {
    try {
      await signIn("google", { callbackUrl: RouteNames.HOME });
    } catch (error) {
      setGlobalError("Ошибка авторизации через Google");
    }
  };

  const handleTelegramAuth = () => {
    // TODO: Интеграция с Telegram OAuth
    setGlobalError("Telegram авторизация в разработке");
  };
  return (
    <div className={styles.page} onMouseMove={handleMouseMove}>
      <GoBack />
      {/*<ThemeToggle />*/}
      <main
        className={styles.main}
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Crypto Monitor</h1>
          <p className={styles.subtitle}>
            Отслеживание криптовалют в реальном времени
          </p>
        </div>

        {/* Auth Card */}
        <div className={styles.card}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <Button
              type="button"
              variant="tab"
              isActive={activeTab === "login"}
              onClick={() => setActiveTab("login")}
            >
              Войти
            </Button>
            <Button
              type="button"
              variant="tab"
              isActive={activeTab === "register"}
              onClick={() => setActiveTab("register")}
            >
              Регистрация
            </Button>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons
            onGoogleClick={handleGoogleAuth}
            onTelegramClick={handleTelegramAuth}
          />

          <div className={styles.divider}>
            <span className={styles.dividerText}>или</span>
          </div>

          {/* Form */}
          {activeTab === "login" ? (
            <LoginForm onError={setGlobalError} globalError={globalError} />
          ) : (
            <RegisterForm onError={setGlobalError} globalError={globalError} />
          )}
        </div>
      </main>
    </div>
  );
}
