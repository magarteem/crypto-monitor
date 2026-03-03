"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./CryptoChart.module.css";
import { useTickers24hr } from "@api/hooks";
import { CryptoCoins, type CryptoCoin } from "@/app/shared/const/cryptoConst";
import GraphikV2Wrapper from "../graphikV2/GraphikV2Wrapper";
import {
  Columns1Icon,
  Columns2Icon,
  Columns3Icon,
  Columns4Icon,
  Columns5Icon,
} from "@/public/img";
import { CoinSelectorModal } from "../modals/CoinSelectorModal";

const MOBILE_BREAKPOINT = 768;

export const CryptoChart = () => {
  const [selectedCoins, setSelectedCoins] = useState<CryptoCoins>([]);
  const [columns, setColumns] = useState<number>(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem("selected-coins");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CryptoCoins;
        setSelectedCoins(parsed);
      } catch (e) {
        console.error("Error parsing selected coins:", e);
      }
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Сохранение выбранных монет
  const handleSaveCoins = (coins: CryptoCoin[]) => {
    localStorage.setItem("selected-coins", JSON.stringify(coins));
    setSelectedCoins(coins as CryptoCoins);
  };

  // Удаление монеты из списка
  const handleRemoveCoin = (symbolToRemove: string) => {
    const updatedCoins = selectedCoins.filter((coin) => coin.symbol !== symbolToRemove);
    localStorage.setItem("selected-coins", JSON.stringify(updatedCoins));
    setSelectedCoins(updatedCoins as CryptoCoins);
  };

  // Получаем символы всех монет
  const symbols = useMemo(() => selectedCoins?.map((coin) => coin.symbol) ?? [], [selectedCoins]);

  // Загружаем данные всех монет одним запросом
  const { data: cryptoData, isLoading } = useTickers24hr(symbols);

  // Показываем загрузку пока не инициализировались на клиенте
  if (!isClient || isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Загрузка данных о криптовалютах...</p>
      </div>
    );
  }

  // Маппинг иконок для колонок
  const columnIcons = {
    1: Columns1Icon,
    2: Columns2Icon,
    3: Columns3Icon,
    4: Columns4Icon,
    5: Columns5Icon,
  };

  return (
    <div className={styles.wrapper}>

      {
        !selectedCoins?.length ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateContent}>
              <h3 className={styles.emptyStateTitle}> Выберите криптовалюты, которые хотите отслеживать</h3>

              <button
                className={styles.selectCoinsButton}
                onClick={() => setIsModalOpen(true)}
              >
                Выбрать монеты
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`${styles.controls} ${isMobile ? styles.controlsMobile : ""}`}>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={styles.addCoinButton}
                title="Добавить монеты"
                aria-label="Добавить монеты"
              >
                <span className={styles.addIcon}>+</span>
                Добавить
              </button>

              {!isMobile && (
                <div className={styles.columnsSelector}>
                  {[1, 2, 3, 4, 5].map((num) => {
                    const IconComponent = columnIcons[num as keyof typeof columnIcons];
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setColumns(num)}
                        className={`${styles.columnsButton} ${columns === num ? styles.active : ""
                          }`}
                        title={`${num} колонок`}
                        aria-label={`${num} колонок`}
                      >
                        <IconComponent width="20" height="20" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              className={styles.chartsGrid}
              style={
                {
                  "--columns": isMobile ? 1 : columns,
                  "--grid-gap":
                    isMobile
                      ? "0.75rem"
                      : columns >= 5
                        ? "0.75rem"
                        : columns >= 4
                          ? "1rem"
                          : "2rem",
                  "--grid-padding":
                    isMobile
                      ? "0.75rem"
                      : columns >= 5
                        ? "0.75rem"
                        : columns >= 4
                          ? "1rem"
                          : "2rem",
                } as React.CSSProperties
              }
            >
              {selectedCoins.map((coin) => {
                const data = cryptoData?.[coin.symbol];
                if (!data) return null;

                const chartHeight = isMobile
                  ? "280px"
                  : columns === 1
                    ? "600px"
                    : columns === 2
                      ? "500px"
                      : columns === 3
                        ? "400px"
                        : columns === 4
                          ? "320px"
                          : "280px";

                return (
                  <div key={coin.symbol} className={styles.chartItem}>
                    <GraphikV2Wrapper
                      symbol={coin.symbol}
                      name={coin.name}
                      currentPrice={data.currentPrice}
                      change={data.change}
                      chartHeight={chartHeight}
                      onRemove={handleRemoveCoin}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )
      }

      {/* Модалка выбора монет */}
      <CoinSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCoins={[...selectedCoins]}
        onSave={handleSaveCoins}
      />
    </div>
  );
};
