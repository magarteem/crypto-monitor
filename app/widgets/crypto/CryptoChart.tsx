"use client";

import { useState, useMemo } from "react";
import styles from "./CryptoChart.module.css";
import { useTickers24hr } from "@api/hooks";
import { CRYPTO_COINS } from "@/app/shared/const/cryptoConst";
import GraphikV2Wrapper from "../graphikV2/GraphikV2Wrapper";
import {
  Columns1Icon,
  Columns2Icon,
  Columns3Icon,
  Columns4Icon,
  Columns5Icon,
} from "@/public/img";

export const CryptoChart = () => {
  const [columns, setColumns] = useState<number>(3);

  // Получаем символы всех монет
  const symbols = useMemo(() => CRYPTO_COINS.map((coin) => coin.symbol), []);

  // Загружаем данные всех монет одним запросом
  const { data: cryptoData, isLoading } = useTickers24hr(symbols);

  if (isLoading) {
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
      <div className={styles.controls}>
        <div className={styles.columnsSelector}>
          {[1, 2, 3, 4, 5].map((num) => {
            const IconComponent = columnIcons[num as keyof typeof columnIcons];
            return (
              <button
                key={num}
                type="button"
                onClick={() => setColumns(num)}
                className={`${styles.columnsButton} ${
                  columns === num ? styles.active : ""
                }`}
                title={`${num} колонок`}
                aria-label={`${num} колонок`}
              >
                <IconComponent width="20" height="20" />
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={styles.chartsGrid}
        style={
          {
            "--columns": columns,
            "--grid-gap":
              columns >= 5 ? "0.75rem" : columns >= 4 ? "1rem" : "2rem",
            "--grid-padding":
              columns >= 5 ? "0.75rem" : columns >= 4 ? "1rem" : "2rem",
          } as React.CSSProperties
        }
      >
        {CRYPTO_COINS.map((coin) => {
          const data = cryptoData?.[coin.symbol];
          if (!data) return null;

          const chartHeight =
            columns === 1
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
