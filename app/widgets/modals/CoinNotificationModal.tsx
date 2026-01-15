"use client";

import React, { useState, useEffect } from "react";
import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import { Modal } from "@ui/modal";
import { Button } from "@ui/button";
import {
  ClockIcon,
  TrendDownIcon,
  TrendUpIcon,
} from "@/public/img";
import styles from "./CoinNotificationModal.module.css";

interface CoinNotificationSettings {
  updateInterval: number; // в миллисекундах
  priceDropThreshold: number; // процент падения
  priceGrowthThreshold: number; // процент роста
  trackDrop: boolean; // отслеживать падение
  trackGrowth: boolean; // отслеживать рост
}

interface CoinNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  name?: string;
  defaultSettings?: Partial<CoinNotificationSettings>;
  onSave?: (settings: CoinNotificationSettings) => void;
}

const DEFAULT_SETTINGS: CoinNotificationSettings = {
  updateInterval: 300000, // 5 минут
  priceDropThreshold: 5, // 5%
  priceGrowthThreshold: 5, // 5%
  trackDrop: true,
  trackGrowth: true,
};

export function CoinNotificationModal({
  isOpen,
  onClose,
  symbol,
  name,
  defaultSettings,
  onSave,
}: CoinNotificationModalProps) {
  const [settings, setSettings] = useState<CoinNotificationSettings>({
    ...DEFAULT_SETTINGS,
    ...defaultSettings,
  });

  // Загрузка сохраненных настроек из localStorage при открытии
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(`coinNotificationSettings_${symbol}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed,
            ...defaultSettings,
          });
        } catch (e) {
          console.error("Error loading coin notification settings:", e);
        }
      } else if (defaultSettings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...defaultSettings,
        });
      }
    }
  }, [isOpen, symbol, defaultSettings]);

  const handleSave = () => {
    // Сохраняем настройки в localStorage
    localStorage.setItem(
      `coinNotificationSettings_${symbol}`,
      JSON.stringify(settings)
    );
    onSave?.(settings);
    console.log(`Настройки уведомлений для ${symbol}:`, settings);
    onClose();
  };

  // Преобразование миллисекунд в минуты для отображения
  const intervalInMinutes = Math.round(settings.updateInterval / 60000);

  const displayName = name || symbol.replace("USDT", "/USDT");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Настройки уведомлений: ${displayName}`}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </>
      }
    >
      <VStack gap="1.5rem" align="stretch">
        {/* Интервал обновления */}
        <Box className={styles.section}>
          <HStack className={styles.sectionTitle} justify="space-between">
            <HStack gap="0.625rem">
              <ClockIcon width="20" height="20" className={styles.sectionIcon} />
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
                      updateInterval: parseInt(e.target.value) * 60000,
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
              Рекомендуется: 5-15 минут. Меньше = чаще проверяет, но больше
              запросов к API
            </Text>
          </VStack>
        </Box>

        {/* Алерт при падении */}
        <Box className={styles.section}>
          <HStack className={styles.sectionTitle} justify="space-between">
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
          <HStack className={styles.sectionTitle} justify="space-between">
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
                      priceGrowthThreshold: parseFloat(e.target.value),
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
      </VStack>
    </Modal>
  );
}
