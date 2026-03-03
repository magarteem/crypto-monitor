"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ClientSocketConnection } from "@/app/shared/components/client-socket-connection/ClientSocketConnection";
import GraphikV2Wrapper from "@/app/widgets/graphikV2/GraphikV2Wrapper";
import { useTickers24hr } from "@api/hooks";
import { ArrowLeftIcon } from "@/public/img";
import styles from "./page.module.css";

const MOBILE_BREAKPOINT = 768;

function normalizeSymbol(symbol: string): string {
  const s = symbol.toUpperCase();
  return s.endsWith("USDT") ? s : `${s}USDT`;
}

function symbolToName(symbol: string): string {
  const base = symbol.replace("USDT", "");
  return `${base}/USDT`;
}

export default function ChartPage() {
  const params = useParams();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const rawSymbol = typeof params.symbol === "string" ? params.symbol : "";
  const symbol = normalizeSymbol(rawSymbol);
  const name = symbolToName(symbol);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { data: cryptoData, isLoading } = useTickers24hr([symbol]);
  const tickerData = cryptoData?.[symbol];

  if (!rawSymbol) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.error}>
            <p>Символ не указан</p>
            <Link href="/" className={styles.backLink}>
              <ArrowLeftIcon width="20" height="20" />
              На главную
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <ClientSocketConnection>
      <div className={styles.page}>
        <div className={styles.bgBase} aria-hidden />
        <div className={`${styles.grid3dWave} grid-3d-wave`} aria-hidden />

        <main className={styles.main}>
          <div className={styles.toolbar}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => router.push("/")}
              aria-label="Назад"
            >
              <ArrowLeftIcon width="20" height="20" />
              <span>Назад</span>
            </button>
            <h1 className={styles.title}>{name}</h1>
          </div>

          <div className={styles.chartWrapper}>
            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Загрузка графика...</p>
              </div>
            ) : (
              <GraphikV2Wrapper
                symbol={symbol}
                name={name}
                currentPrice={tickerData?.currentPrice}
                change={tickerData?.change}
                chartHeight={isMobile ? "320px" : "min(700px, calc(100vh - 120px))"}
              />
            )}
          </div>
        </main>
      </div>
    </ClientSocketConnection>
  );
}
