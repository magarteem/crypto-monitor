"use client";

import { useTheme } from "@/app/shared/hooks/useTheme";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button className={styles.toggle} disabled>
        <span className={styles.icon}>🌙</span>
      </button>
    );
  }

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={
        theme === "light"
          ? "Переключить на темную тему"
          : "Переключить на светлую тему"
      }
    >
      <span className={styles.icon}>{theme === "light" ? "🌙" : "☀️"}</span>
    </button>
  );
}
