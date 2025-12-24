"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./widgets/Header";
import { ProfileSidebar } from "./widgets/ProfileSidebar";
import { SettingsSidebar } from "./widgets/SettingsSidebar";
import styles from "./page.module.css";
import { CryptoChart } from "@widgets/crypto/CryptoChart";
import { CRYPTO_COINS } from "@const/cryptoConst";

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
