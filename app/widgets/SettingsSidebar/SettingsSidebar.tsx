"use client";

import { useState, useEffect } from "react";
import styles from "./SettingsSidebar.module.css";
import { CRYPTO_COINS } from "@const/cryptoConst";

// Список символов для настроек
const CRYPTO_SYMBOLS = CRYPTO_COINS.map((coin) => coin.symbol);

interface SettingsData {
  updateInterval: number; // в миллисекундах
  priceDropThreshold: number; // процент падения
  priceGrowthThreshold: number; // процент роста
  selectedCoins: string[];
  trackDrop: boolean; // отслеживать падение
  trackGrowth: boolean; // отслеживать рост
}

const DEFAULT_SETTINGS: SettingsData = {
  updateInterval: 300000, // 5 минут
  priceDropThreshold: 5, // 5%
  priceGrowthThreshold: 5, // 5%
  selectedCoins: [...CRYPTO_SYMBOLS],
  trackDrop: true,
  trackGrowth: true,
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
    alert("✅ Настройки сохранены! Перезагрузите страницу для применения.");
  };

  const toggleCoin = (coin: string) => {
    setSettings((prev) => ({
      ...prev,
      selectedCoins: prev.selectedCoins.includes(coin)
        ? prev.selectedCoins.filter((c) => c !== coin)
        : [...prev.selectedCoins, coin],
    }));
  };

  const selectAllCoins = () => {
    setSettings((prev) => ({
      ...prev,
      selectedCoins: [...CRYPTO_SYMBOLS],
    }));
  };

  const deselectAllCoins = () => {
    setSettings((prev) => ({
      ...prev,
      selectedCoins: [],
    }));
  };

  // Преобразование миллисекунд в минуты для отображения
  const intervalInMinutes = Math.round(settings.updateInterval / 60000);

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
          {/* Интервал обновления */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>⏱️</span>
              Интервал обновления
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Как часто проверять цены (минуты)
              </label>
              <div className={styles.rangeContainer}>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={intervalInMinutes}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      updateInterval: parseInt(e.target.value) * 60000,
                    }))
                  }
                  className={styles.rangeInput}
                />
                <span className={styles.rangeValue}>
                  {intervalInMinutes} мин
                </span>
              </div>
              <p className={styles.hint}>
                Рекомендуется: 5-15 минут. Меньше = чаще проверяет, но больше
                запросов к API
              </p>
            </div>
          </div>

          {/* Процент падения */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📉</span>
              Алерт при падении
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={settings.trackDrop}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      trackDrop: e.target.checked,
                    }))
                  }
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Процент падения цены</label>
              <div className={styles.rangeContainer}>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={settings.priceDropThreshold}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      priceDropThreshold: parseFloat(e.target.value),
                    }))
                  }
                  className={styles.rangeInput}
                  disabled={!settings.trackDrop}
                />
                <span className={styles.rangeValue}>
                  -{settings.priceDropThreshold}%
                </span>
              </div>
              <p className={styles.hint}>
                {settings.trackDrop
                  ? "Уведомление придет, если цена упадет на этот процент или больше"
                  : "Отслеживание падения отключено"}
              </p>
            </div>
          </div>

          {/* Процент роста */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📈</span>
              Алерт при росте
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={settings.trackGrowth}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      trackGrowth: e.target.checked,
                    }))
                  }
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Процент роста цены</label>
              <div className={styles.rangeContainer}>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={settings.priceGrowthThreshold}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      priceGrowthThreshold: parseFloat(e.target.value),
                    }))
                  }
                  className={styles.rangeInput}
                  disabled={!settings.trackGrowth}
                />
                <span className={styles.rangeValue}>
                  +{settings.priceGrowthThreshold}%
                </span>
              </div>
              <p className={styles.hint}>
                {settings.trackGrowth
                  ? "Уведомление придет, если цена вырастет на этот процент или больше"
                  : "Отслеживание роста отключено"}
              </p>
            </div>
          </div>

          {/* Выбор монет */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>💰</span>
              Отслеживаемые монеты
            </div>

            <div className={styles.selectButtons}>
              <button
                className={styles.selectButton}
                onClick={selectAllCoins}
                type="button"
              >
                Выбрать все
              </button>
              <button
                className={styles.selectButton}
                onClick={deselectAllCoins}
                type="button"
              >
                Снять все
              </button>
              <span className={styles.coinCounter}>
                {settings.selectedCoins.length} / {CRYPTO_SYMBOLS.length}
              </span>
            </div>

            <div className={styles.coinsGrid}>
              {CRYPTO_SYMBOLS.map((coin) => (
                <div key={coin} className={styles.coinCheckbox}>
                  <input
                    type="checkbox"
                    id={coin}
                    checked={settings.selectedCoins.includes(coin)}
                    onChange={() => toggleCoin(coin)}
                  />
                  <label htmlFor={coin}>
                    {coin.replace("USDT", "").replace("USDC", "")}
                  </label>
                </div>
              ))}
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
