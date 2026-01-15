"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Box, VStack, HStack, Text, Flex } from "@chakra-ui/react";
import styles from "./SettingsSidebar.module.css";
import { CRYPTO_COINS } from "@const/cryptoConst";
import { RouteNames } from "@sharedTypes/RouteNames";
import {
  SettingsIcon,
  ClockIcon,
  TrendDownIcon,
  TrendUpIcon,
  CoinsIcon,
  SaveIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/public/img";

// Список символов для настроек
const CRYPTO_SYMBOLS = CRYPTO_COINS.map((coin) => coin.symbol);

interface SettingsData {
  updateInterval: number; // в миллисекундах
  priceDropThreshold: number; // процент падения
  priceGrowthThreshold: number; // процент роста
  selectedCoins: string[];
  trackDrop: boolean; // отслеживать падение
  trackGrowth: boolean; // отслеживать рост
  notifications: {
    telegram: boolean;
    push: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  theme: "light" | "dark";
  locale: "ru" | "en";
}

const DEFAULT_SETTINGS: SettingsData = {
  updateInterval: 300000, // 5 минут
  priceDropThreshold: 5, // 5%
  priceGrowthThreshold: 5, // 5%
  selectedCoins: [...CRYPTO_SYMBOLS],
  trackDrop: true,
  trackGrowth: true,
  notifications: {
    telegram: true,
    push: true,
    whatsapp: false,
    email: true,
  },
  theme: "dark",
  locale: "ru",
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
  const [expandedSection, setExpandedSection] = useState<
    "notifications" | "coins" | "app" | null
  >("notifications");

  // Тариф пользователя (пока хардкодим FREE, в будущем можно получать из API)
  const userTariff = "FREE"; // TODO: Получать из API или контекста
  const maxCoinsForTariff = userTariff === "FREE" ? 3 : CRYPTO_SYMBOLS.length;

  // Загрузка настроек из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chanceMonitorSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ограничиваем количество монет для FREE тарифа
        if (
          userTariff === "FREE" &&
          parsed.selectedCoins?.length > maxCoinsForTariff
        ) {
          parsed.selectedCoins = parsed.selectedCoins.slice(
            0,
            maxCoinsForTariff
          );
        }
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          notifications: {
            ...DEFAULT_SETTINGS.notifications,
            ...parsed.notifications,
          },
        });
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }, [userTariff, maxCoinsForTariff]);

  const handleSave = () => {
    localStorage.setItem("chanceMonitorSettings", JSON.stringify(settings));
    onSettingsChange?.(settings);
    onClose();

    // Показываем уведомление
    alert("✅ Настройки сохранены! Перезагрузите страницу для применения.");
  };

  const toggleSection = (section: "notifications" | "coins" | "app") => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const toggleCoin = (coin: string) => {
    setSettings((prev) => {
      const isCurrentlySelected = prev.selectedCoins.includes(coin);

      // Если монета уже выбрана, просто убираем её
      if (isCurrentlySelected) {
        return {
          ...prev,
          selectedCoins: prev.selectedCoins.filter((c) => c !== coin),
        };
      }

      // Если монета не выбрана, проверяем лимит
      if (prev.selectedCoins.length >= maxCoinsForTariff) {
        // Достигнут лимит, нельзя добавить больше
        return prev;
      }

      // Добавляем монету
      return {
        ...prev,
        selectedCoins: [...prev.selectedCoins, coin],
      };
    });
  };

  const selectAllCoins = () => {
    setSettings((prev) => ({
      ...prev,
      selectedCoins: CRYPTO_SYMBOLS.slice(0, maxCoinsForTariff),
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
      <Box className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        {/* Header */}
        <Flex className={styles.header} justify="space-between" align="center">
          <HStack gap="0.625rem">
            <SettingsIcon
              width="24"
              height="24"
              className={styles.headerIcon}
            />
            <Text className={styles.title}>Настройки</Text>
          </HStack>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть"
            type="button"
          >
            <XIcon width="20" height="20" />
          </button>
        </Flex>

        {/* Content */}
        <VStack className={styles.content} gap="1rem" align="stretch">
          {/* 1. Мэнеджер уведомлений */}
          <Box
            className={`${styles.accordionItem} ${
              expandedSection === "notifications" ? styles.expanded : ""
            }`}
          >
            <button
              type="button"
              className={styles.accordionHeader}
              onClick={() => toggleSection("notifications")}
            >
              <HStack gap="0.625rem">
                <SettingsIcon
                  width="20"
                  height="20"
                  className={styles.sectionIcon}
                />
                <Text className={styles.accordionTitle}>
                  Мэнеджер уведомлений
                </Text>
              </HStack>
              {expandedSection === "notifications" ? (
                <ChevronUpIcon width="20" height="20" />
              ) : (
                <ChevronDownIcon width="20" height="20" />
              )}
            </button>
            <Box className={styles.accordionContent}>
              {expandedSection === "notifications" && (
                <Box className={styles.accordionContentInner}>
                  <Text className={styles.notificationsTitle}>
                    Получать уведомления на:
                  </Text>
                  <VStack gap="0.75rem" align="stretch" mt="1rem">
                    <label className={styles.notificationCheckbox}>
                      <input
                        type="checkbox"
                        checked={settings.notifications.telegram}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              telegram: e.target.checked,
                            },
                          }))
                        }
                      />
                      <span>Telegram Bot</span>
                    </label>
                    <label className={styles.notificationCheckbox}>
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              push: e.target.checked,
                            },
                          }))
                        }
                      />
                      <span>Push Notification this device</span>
                    </label>
                    <label className={styles.notificationCheckbox}>
                      <input
                        type="checkbox"
                        checked={settings.notifications.whatsapp}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              whatsapp: e.target.checked,
                            },
                          }))
                        }
                      />
                      <span>WhatsApp</span>
                    </label>
                    <label className={styles.notificationCheckbox}>
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              email: e.target.checked,
                            },
                          }))
                        }
                      />
                      <span>Email</span>
                    </label>
                  </VStack>
                </Box>
              )}
            </Box>
          </Box>

          {/* 2. Отслеживаемые монеты */}
          <Box
            className={`${styles.accordionItem} ${
              expandedSection === "coins" ? styles.expanded : ""
            }`}
          >
            <button
              type="button"
              className={styles.accordionHeader}
              onClick={() => toggleSection("coins")}
            >
              <HStack gap="0.625rem">
                <CoinsIcon
                  width="20"
                  height="20"
                  className={styles.sectionIcon}
                />
                <Text className={styles.accordionTitle}>
                  Отслеживаемые монеты
                </Text>
              </HStack>
              {expandedSection === "coins" ? (
                <ChevronUpIcon width="20" height="20" />
              ) : (
                <ChevronDownIcon width="20" height="20" />
              )}
            </button>
            <Box className={styles.accordionContent}>
              {expandedSection === "coins" && (
                <Box className={styles.accordionContentInner}>
                  {/* Выбор монет */}
                  <Box className={styles.section}>
                    <VStack gap="0.75rem" mb="1rem" align="stretch">
                      <HStack gap="0.5rem" align="center">
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
                      </HStack>
                    </VStack>

                    {userTariff === "FREE" &&
                      settings.selectedCoins.length >= maxCoinsForTariff && (
                        <Box className={styles.tariffWarning} mb="0.75rem">
                          <Text className={styles.tariffWarningText}>
                            Достигнут лимит для FREE тарифа. maximum{" "}
                            {maxCoinsForTariff} tokens.
                          </Text>
                          <Link
                            href={RouteNames.TARIFFS}
                            className={styles.upgradeButton}
                          >
                            Upgrade plan
                          </Link>
                        </Box>
                      )}

                    <Box className={styles.coinsGrid}>
                      {CRYPTO_SYMBOLS.map((coin) => {
                        const isSelected =
                          settings.selectedCoins.includes(coin);
                        const isDisabled =
                          userTariff === "FREE" &&
                          !isSelected &&
                          settings.selectedCoins.length >= maxCoinsForTariff;

                        return (
                          <label
                            key={coin}
                            className={`${styles.coinCheckbox} ${
                              isDisabled ? styles.disabled : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCoin(coin)}
                              disabled={isDisabled}
                            />
                            <span>
                              {coin.replace("USDT", "").replace("USDC", "")}
                            </span>
                          </label>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Интервал обновления */}
                  <Box className={styles.section}>
                    <HStack
                      className={styles.sectionTitle}
                      justify="space-between"
                    >
                      <HStack gap="0.625rem">
                        <ClockIcon
                          width="20"
                          height="20"
                          className={styles.sectionIcon}
                        />
                        <Text as="span" fontWeight="700" fontSize="1.05rem">
                          Интервал обновления
                        </Text>
                      </HStack>
                    </HStack>
                    <VStack align="stretch" gap="0.875rem" mt="1.25rem">
                      <Text className={styles.label}>
                        Как часто проверять цены (минуты)
                      </Text>
                      <HStack gap="1rem" align="center">
                        <Box flex="1" width="100%">
                          <input
                            type="range"
                            min="1"
                            max="60"
                            step="1"
                            value={intervalInMinutes}
                            onChange={(e) => {
                              setSettings((prev) => ({
                                ...prev,
                                updateInterval:
                                  parseInt(e.target.value) * 60000,
                              }));
                            }}
                            className={styles.rangeInput}
                          />
                        </Box>
                        <Text
                          className={styles.rangeValue}
                          minW="70px"
                          textAlign="right"
                        >
                          {intervalInMinutes} мин
                        </Text>
                      </HStack>
                      <Text className={styles.hint}>
                        Рекомендуется: 5-15 минут. Меньше = чаще проверяет, но
                        больше запросов к API
                      </Text>
                    </VStack>
                  </Box>

                  {/* Алерт при падении */}
                  <Box className={styles.section}>
                    <HStack
                      className={styles.sectionTitle}
                      justify="space-between"
                    >
                      <HStack gap="0.625rem">
                        <TrendDownIcon
                          width="20"
                          height="20"
                          className={styles.sectionIcon}
                        />
                        <Text as="span" fontWeight="700" fontSize="1.05rem">
                          Алерт при падении
                        </Text>
                      </HStack>
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
                    </HStack>
                    <VStack align="stretch" gap="0.875rem" mt="1.25rem">
                      <Text className={styles.label}>Процент падения цены</Text>
                      <HStack gap="1rem" align="center">
                        <Box flex="1" width="100%">
                          <input
                            type="range"
                            min="0.5"
                            max="20"
                            step="0.5"
                            value={settings.priceDropThreshold}
                            onChange={(e) => {
                              setSettings((prev) => ({
                                ...prev,
                                priceDropThreshold: parseFloat(e.target.value),
                              }));
                            }}
                            disabled={!settings.trackDrop}
                            className={styles.rangeInput}
                          />
                        </Box>
                        <Text
                          className={styles.rangeValue}
                          minW="70px"
                          textAlign="right"
                        >
                          -{settings.priceDropThreshold}%
                        </Text>
                      </HStack>
                      <Text className={styles.hint}>
                        {settings.trackDrop
                          ? "Уведомление придет, если цена упадет на этот процент или больше"
                          : "Отслеживание падения отключено"}
                      </Text>
                    </VStack>
                  </Box>

                  {/* Алерт при росте */}
                  <Box className={styles.section}>
                    <HStack
                      className={styles.sectionTitle}
                      justify="space-between"
                    >
                      <HStack gap="0.625rem">
                        <TrendUpIcon
                          width="20"
                          height="20"
                          className={styles.sectionIcon}
                        />
                        <Text as="span" fontWeight="700" fontSize="1.05rem">
                          Алерт при росте
                        </Text>
                      </HStack>
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
                    </HStack>
                    <VStack align="stretch" gap="0.875rem" mt="1.25rem">
                      <Text className={styles.label}>Процент роста цены</Text>
                      <HStack gap="1rem" align="center">
                        <Box flex="1" width="100%">
                          <input
                            type="range"
                            min="0.5"
                            max="20"
                            step="0.5"
                            value={settings.priceGrowthThreshold}
                            onChange={(e) => {
                              setSettings((prev) => ({
                                ...prev,
                                priceGrowthThreshold: parseFloat(
                                  e.target.value
                                ),
                              }));
                            }}
                            disabled={!settings.trackGrowth}
                            className={styles.rangeInput}
                          />
                        </Box>
                        <Text
                          className={styles.rangeValue}
                          minW="70px"
                          textAlign="right"
                        >
                          +{settings.priceGrowthThreshold}%
                        </Text>
                      </HStack>
                      <Text className={styles.hint}>
                        {settings.trackGrowth
                          ? "Уведомление придет, если цена вырастет на этот процент или больше"
                          : "Отслеживание роста отключено"}
                      </Text>
                    </VStack>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* 3. Настройки приложения */}
          <Box
            className={`${styles.accordionItem} ${
              expandedSection === "app" ? styles.expanded : ""
            }`}
          >
            <button
              type="button"
              className={styles.accordionHeader}
              onClick={() => toggleSection("app")}
            >
              <HStack gap="0.625rem">
                <SettingsIcon
                  width="20"
                  height="20"
                  className={styles.sectionIcon}
                />
                <Text className={styles.accordionTitle}>
                  Настройки приложения
                </Text>
              </HStack>
              {expandedSection === "app" ? (
                <ChevronUpIcon width="20" height="20" />
              ) : (
                <ChevronDownIcon width="20" height="20" />
              )}
            </button>
            <Box className={styles.accordionContent}>
              {expandedSection === "app" && (
                <Box className={styles.accordionContentInner}>
                  {/* Тема */}
                  <Box className={styles.section}>
                    <HStack
                      className={styles.sectionTitle}
                      justify="space-between"
                    >
                      <Text as="span" fontWeight="700" fontSize="1.05rem">
                        Тема
                      </Text>
                    </HStack>
                    <VStack align="stretch" gap="0.875rem" mt="1.25rem">
                      <HStack gap="0.5rem">
                        <button
                          type="button"
                          className={`${styles.themeButton} ${
                            settings.theme === "light" ? styles.active : ""
                          }`}
                          onClick={() =>
                            setSettings((prev) => ({ ...prev, theme: "light" }))
                          }
                        >
                          Светлая
                        </button>
                        <button
                          type="button"
                          className={`${styles.themeButton} ${
                            settings.theme === "dark" ? styles.active : ""
                          }`}
                          onClick={() =>
                            setSettings((prev) => ({ ...prev, theme: "dark" }))
                          }
                        >
                          Темная
                        </button>
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Локализация */}
                  <Box className={styles.section}>
                    <HStack
                      className={styles.sectionTitle}
                      justify="space-between"
                    >
                      <Text as="span" fontWeight="700" fontSize="1.05rem">
                        Локализация
                      </Text>
                    </HStack>
                    <VStack align="stretch" gap="0.875rem" mt="1.25rem">
                      <HStack gap="0.5rem">
                        <button
                          type="button"
                          className={`${styles.themeButton} ${
                            settings.locale === "ru" ? styles.active : ""
                          }`}
                          onClick={() =>
                            setSettings((prev) => ({ ...prev, locale: "ru" }))
                          }
                        >
                          Русский
                        </button>
                        <button
                          type="button"
                          className={`${styles.themeButton} ${
                            settings.locale === "en" ? styles.active : ""
                          }`}
                          onClick={() =>
                            setSettings((prev) => ({ ...prev, locale: "en" }))
                          }
                        >
                          English
                        </button>
                      </HStack>
                    </VStack>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Кнопка сохранения */}
          <button
            className={styles.saveButton}
            onClick={handleSave}
            type="button"
          >
            <SaveIcon width="18" height="18" />
            Сохранить настройки
          </button>

          {/* Версия приложения */}
          <Text className={styles.appVersion}>v0.1.0</Text>
        </VStack>
      </Box>
    </>
  );
};
