"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  //useEffect(() => {
  //  setMounted(true);
  //  // Получаем сохраненную тему из localStorage
  //  const savedTheme = localStorage.getItem("theme") as Theme;
  //  if (savedTheme) {
  //    setTheme(savedTheme);
  //    document.documentElement.setAttribute("data-theme", savedTheme);
  //  } else {
  //    // Проверяем системные предпочтения
  //    const prefersDark = window.matchMedia(
  //      "(prefers-color-scheme: dark)"
  //    ).matches;
  //    const initialTheme = prefersDark ? "dark" : "light";
  //    setTheme(initialTheme);
  //    document.documentElement.setAttribute("data-theme", initialTheme);
  //  }
  //}, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return { theme, toggleTheme, mounted };
}
