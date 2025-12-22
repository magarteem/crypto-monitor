"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./_widgets/Header";
import { ProfileSidebar } from "./_widgets/ProfileSidebar";
import { SettingsSidebar } from "./_widgets/SettingsSidebar";
import { CryptoChart } from "./CryptoChart";
import styles from "./page.module.css";

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cryptoData, setCryptoData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/auth");
  };

  // Получаем базовую информацию (изменение за 24ч)
  const fetchInitialData = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
      );
      const data = await response.json();

      return {
        currentPrice: parseFloat(data.lastPrice),
        change: parseFloat(data.priceChangePercent).toFixed(2),
      };
    } catch (error) {
      console.error(`Error fetching initial data for ${symbol}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const dataPromises = CRYPTO_COINS.map(async (coin) => {
        const data = await fetchInitialData(coin.symbol);
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

    loadInitialData();
  }, []);

  return (
    <div className={styles.page}>
      <Header
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onDisconnect={handleLogout}
      />
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

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
