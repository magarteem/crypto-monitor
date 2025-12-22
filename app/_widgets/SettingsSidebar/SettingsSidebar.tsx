"use client";

import { useState, useEffect } from "react";
import styles from "./SettingsSidebar.module.css";

interface SettingsData {
  theme: "light" | "dark";
  notifications: boolean;
  language: string;
}

const DEFAULT_SETTINGS: SettingsData = {
  theme: "dark",
  notifications: true,
  language: "ru",
};

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: SettingsData) => void;
}

export const SettingsSidebar = ({
  isOpen,
  onClose,
  onSettingsChange,
}: SettingsSidebarProps) => {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);

  // Загрузка настроек из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chanceMonitorSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("chanceMonitorSettings", JSON.stringify(settings));
    onSettingsChange?.(settings);
    onClose();

    // Показываем уведомление
    alert("✅ Настройки сохранены!");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚙️ Настройки</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
            type="button"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {/* Тема */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🎨</span>
              Тема интерфейса
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Выберите тему</label>
              <select
                className={styles.select}
                value={settings.theme}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    theme: e.target.value as "light" | "dark",
                  }))
                }
              >
                <option value="dark">Темная</option>
                <option value="light">Светлая</option>
              </select>
            </div>
          </div>

          {/* Уведомления */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🔔</span>
              Уведомления
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: e.target.checked,
                    }))
                  }
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.inputGroup}>
              <p className={styles.hint}>
                {settings.notifications
                  ? "Вы будете получать уведомления о важных событиях"
                  : "Уведомления отключены"}
              </p>
            </div>
          </div>

          {/* Язык */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🌍</span>
              Язык
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Выберите язык</label>
              <select
                className={styles.select}
                value={settings.language}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    language: e.target.value,
                  }))
                }
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Кнопка сохранения */}
          <button
            className={styles.saveButton}
            onClick={handleSave}
            type="button"
          >
            💾 Сохранить настройки
          </button>
        </div>
      </div>
    </>
  );
};
