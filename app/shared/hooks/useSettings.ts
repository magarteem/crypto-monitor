"use client";

import { useState, useEffect, useCallback } from "react";

interface SettingsData {
  updateInterval: number;
  priceDropThreshold: number;
  priceGrowthThreshold: number;
  selectedCoins: string[];
  trackDrop: boolean;
  trackGrowth: boolean;
  notifications: {
    telegram: boolean;
    push: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  theme: "light" | "dark";
  locale: "ru" | "en";
}

const STORAGE_KEY = "chanceMonitorSettings";

/**
 * Хук для работы с настройками приложения в localStorage
 */
export function useSettings(defaultSettings: SettingsData) {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  // Загрузка настроек из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({
          ...defaultSettings,
          ...parsed,
          notifications: {
            ...defaultSettings.notifications,
            ...parsed.notifications,
          },
        });
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }, [defaultSettings]);

  // Сохранение настроек
  const saveSettings = useCallback((newSettings: SettingsData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
  }, []);

  // Обновление отдельного поля
  const updateSetting = useCallback(
    <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      return newSettings;
    },
    [settings]
  );

  return {
    settings,
    setSettings,
    saveSettings,
    updateSetting,
  };
}
