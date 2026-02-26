"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Box, VStack, HStack, Text, Input } from "@chakra-ui/react";
import { Modal } from "@ui/modal";
import { Button } from "@ui/button";
import { useAllUSDTSymbols } from "@api/hooks";
import type { CryptoCoin } from "@/app/shared/const/cryptoConst";
import styles from "./CoinSelectorModal.module.css";

interface CoinSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoins: CryptoCoin[];
  onSave: (coins: CryptoCoin[]) => void;
}

const ITEMS_PER_PAGE = 50;

export function CoinSelectorModal({
  isOpen,
  onClose,
  selectedCoins,
  onSave,
}: CoinSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: allSymbols = [], isLoading } = useAllUSDTSymbols();

  // Инициализация выбранных монет
  useEffect(() => {
    if (isOpen) {
      setSelected(new Set(selectedCoins.map((c) => c.symbol)));
      setVisibleCount(ITEMS_PER_PAGE);
      setSearchQuery("");
    }
  }, [isOpen, selectedCoins]);

  // Фильтрация и поиск
  const filteredSymbols = useMemo(() => {
    if (!allSymbols.length) return [];

    const query = searchQuery.toLowerCase().trim();
    if (!query) return allSymbols;

    return allSymbols.filter(
      (s) =>
        s.symbol.toLowerCase().includes(query) ||
        s.baseAsset.toLowerCase().includes(query)
    );
  }, [allSymbols, searchQuery]);

  // Отображаемые монеты (для infinite scroll)
  const visibleSymbols = useMemo(() => {
    return filteredSymbols.slice(0, visibleCount);
  }, [filteredSymbols, visibleCount]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage > 0.8 && visibleCount < filteredSymbols.length) {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredSymbols.length));
    }
  }, [visibleCount, filteredSymbols.length]);

  // Обработчик выбора/снятия выбора монеты
  const toggleCoin = useCallback((symbol: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  }, []);

  // Сохранение выбранных монет
  const handleSave = useCallback(() => {
    const selectedSymbolsArray = Array.from(selected);
    const coins: CryptoCoin[] = selectedSymbolsArray.map((symbol) => {
      const symbolInfo = allSymbols.find((s) => s.symbol === symbol);
      return {
        symbol,
        name: symbolInfo ? `${symbolInfo.baseAsset}/USDT` : symbol.replace("USDT", "/USDT"),
      };
    });

    onSave(coins);
    onClose();
  }, [selected, allSymbols, onSave, onClose]);

  const hasSelection = selected.size > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Выбор криптовалют для отслеживания"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!hasSelection}>
            Сохранить ({selected.size})
          </Button>
        </>
      }
    >
      <VStack gap="1.5rem" align="stretch">
        {/* Предупреждение */}
        <Box className={styles.warning}>
          <HStack gap="0.75rem" align="flex-start">
            <Box className={styles.warningIcon} fontSize="1.25rem">⚠️</Box>
            <VStack align="stretch" gap="0.5rem">
              <Text fontSize="0.95rem" fontWeight="600">
                Важно!
              </Text>
              <Text fontSize="0.875rem" lineHeight="1.5">
                По данному списку не будут приходить уведомления. Для настройки уведомлений
                укажите монеты отдельно в боковой панели настроек.
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Поиск */}
        <Box className={styles.searchBox}>
          <Box className={styles.searchIcon} fontSize="1.125rem">🔍</Box>
          <Input
            placeholder="Поиск монеты (например, BTC, ETH, SOL...)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            className={styles.searchInput}
          />
        </Box>

        {/* Список монет */}
        {isLoading ? (
          <Box className={styles.loading}>
            <div className={styles.spinner} />
            <Text>Загрузка списка монет...</Text>
          </Box>
        ) : (
          <>
            <Text fontSize="0.875rem" color="rgba(255, 255, 255, 0.6)">
              Найдено: {filteredSymbols.length} монет
              {selected.size > 0 && ` • Выбрано: ${selected.size}`}
            </Text>

            <Box
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className={styles.coinsContainer}
            >
              <VStack gap="0.5rem" align="stretch">
                {visibleSymbols.map((symbolInfo) => {
                  const isSelected = selected.has(symbolInfo.symbol);
                  return (
                    <button
                      key={symbolInfo.symbol}
                      type="button"
                      onClick={() => toggleCoin(symbolInfo.symbol)}
                      className={`${styles.coinItem} ${isSelected ? styles.selected : ""}`}
                    >
                      <HStack justify="space-between" width="100%">
                        <VStack align="flex-start" gap="0.25rem">
                          <Text fontWeight="600" fontSize="1rem">
                            {symbolInfo.baseAsset}
                          </Text>
                          <Text fontSize="0.875rem" color="rgba(255, 255, 255, 0.6)">
                            {symbolInfo.symbol}
                          </Text>
                        </VStack>
                        <Box className={styles.checkbox}>
                          {isSelected && <Box className={styles.checkmark} />}
                        </Box>
                      </HStack>
                    </button>
                  );
                })}

                {visibleCount < filteredSymbols.length && (
                  <Box className={styles.loadingMore}>
                    <div className={styles.spinner} />
                    <Text fontSize="0.875rem">Загрузка...</Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </>
        )}
      </VStack>
    </Modal>
  );
}
