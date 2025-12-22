"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (activeTab === "login") {
      // Проверка тестовых данных
      if (email === "ivan@example.com" && password === "password123") {
        // Устанавливаем cookie для авторизации
        document.cookie = "auth_token=logged_in; path=/; max-age=86400"; // 24 часа
        router.push("/");
      } else {
        setError("Неверный email или пароль");
      }
    } else {
      // Для регистрации - просто переходим на главную
      if (email && password) {
        document.cookie = "auth_token=logged_in; path=/; max-age=86400";
        router.push("/");
      } else {
        setError("Заполните все поля");
      }
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Chancey</h1>
          <p className={styles.subtitle}>
            Fair, Community Driven, Cryptocurrency Lottery
          </p>
        </div>

        {/* Auth Card */}
        <div className={styles.card}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Войти
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "register" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Регистрация
            </button>
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            {activeTab === "register" && (
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Имя
                </label>
                <input
                  type="text"
                  id="name"
                  className={styles.input}
                  placeholder="Введите ваше имя"
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                className={styles.input}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Пароль
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.input}
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {activeTab === "login" && (
              <div className={styles.testAccount}>
                Тестовый аккаунт:{" "}
                <span className={styles.testCredentials}>
                  ivan@example.com / password123
                </span>
              </div>
            )}

            <button type="submit" className={styles.submitButton}>
              {activeTab === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
        </div>

        {/* About Section */}
        <div className={styles.aboutCard}>
          <h2 className={styles.aboutTitle}>О Chancey</h2>
          <p className={styles.aboutDescription}>
            Chancey - это честная, управляемая сообществом криптовалютная
            лотерея, построенная на технологии блокчейн. Каждый билет дает
            равные шансы на победу, а все транзакции прозрачны и отслеживаемы.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚖️</div>
              <div className={styles.featureName}>Честная игра</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <div className={styles.featureName}>Безопасность</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🏆</div>
              <div className={styles.featureName}>Большие призы</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
