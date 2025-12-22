"use client";

import { useState, useEffect } from "react";
import { Header } from "../_widgets/Header";
import { ProfileSidebar } from "../_widgets/ProfileSidebar";
import { SettingsSidebar } from "../_widgets/SettingsSidebar";
import { CryptoChart } from "./CryptoChart";
import styles from "./crypto.module.css";

// Список отслеживаемых монет
const CRYPTO_COINS = [
  { symbol: "BTCUSDT", name: "BTC/USDT" },
  { symbol: "ETHUSDT", name: "ETH/USDT" },
  { symbol: "BNBUSDT", name: "BNB/USDT" },
  { symbol: "SOLUSDT", name: "SOL/USDT" },
  { symbol: "XRPUSDT", name: "XRP/USDT" },
  { symbol: "LINKUSDT", name: "LINK/USDT" },
  { symbol: "LTCUSDT", name: "LTC/USDT" },
  { symbol: "ATOMUSDT", name: "ATOM/USDT" },
  { symbol: "CHZUSDT", name: "CHZ/USDT" },
  { symbol: "AAVEUSDT", name: "AAVE/USDT" },
  { symbol: "INJUSDT", name: "INJ/USDT" },
  { symbol: "GNSUSDT", name: "GNS/USDT" },
];

export default function CryptoPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cryptoData, setCryptoData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Функция для получения исторических данных с Binance
  const fetchCryptoData = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=96`
      );
      const data = await response.json();
      
      return {
        history: data.map((item: any) => ({
          time: new Date(item[0]).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: parseFloat(item[4]), // Цена закрытия
        })),
        currentPrice: parseFloat(data[data.length - 1][4]),
        change: (
          ((parseFloat(data[data.length - 1][4]) - parseFloat(data[0][1])) /
            parseFloat(data[0][1])) *
          100
        ).toFixed(2),
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      const dataPromises = CRYPTO_COINS.map(async (coin) => {
        const data = await fetchCryptoData(coin.symbol);
        return { symbol: coin.symbol, data };
      });

      const results = await Promise.all(dataPromises);
      const dataMap: Record<string, any> = {};
      
      results.forEach((result) => {
        if (result.data) {
          dataMap[result.symbol] = result.data;
        }
      });

      setCryptoData(dataMap);
      setLoading(false);
    };

    loadAllData();
    
    // Обновление каждые 5 минут
    const interval = setInterval(loadAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      <Header onProfileClick={() => setIsProfileOpen(true)} />
      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <SettingsSidebar />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crypto Monitor</h1>
          <p className={styles.subtitle}>
            Отслеживание криптовалют в реальном времени
          </p>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Загрузка данных о криптовалютах...</p>
          </div>
        ) : (
          <div className={styles.chartsGrid}>
            {CRYPTO_COINS.map((coin) => {
              const data = cryptoData[coin.symbol];
              if (!data) return null;

              return (
                <CryptoChart
                  key={coin.symbol}
                  name={coin.name}
                  symbol={coin.symbol}
                  data={data.history}
                  currentPrice={data.currentPrice}
                  change={data.change}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

