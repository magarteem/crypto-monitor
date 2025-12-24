"use client";

import styles from "./cryptoChart.module.css";
import { useTickers24hr } from "@api/hooks";
import { useMemo } from "react";
import { CRYPTO_COINS } from "@/app/shared/const/cryptoConst";
import { CryptoChartItem } from "@/app/entities/cryptoChartItem/CryptoChartItem";

export const CryptoChart = () => {
  // Получаем символы всех монет
  const symbols = useMemo(() => CRYPTO_COINS.map((coin) => coin.symbol), []);

  // Загружаем данные всех монет одним запросом
  const { data: cryptoData, isLoading } = useTickers24hr(symbols);

  if (isLoading) {
    <div className={styles.loading}>
      <div className={styles.spinner} />
      <p>Загрузка данных о криптовалютах...</p>
    </div>;
  }
  return (
    <div className={styles.chartsGrid}>
      {CRYPTO_COINS.map((coin) => {
        const data = cryptoData?.[coin.symbol];
        if (!data) return null;

        return (
          <CryptoChartItem
            key={coin.symbol}
            name={coin.name}
            symbol={coin.symbol}
            currentPrice={data.currentPrice}
            change={data.change}
          />
        );
      })}
    </div>
  );
};
