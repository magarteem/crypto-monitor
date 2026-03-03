"use client";

import { Header } from "@widgets/Header";
import { CryptoChart } from "@widgets/crypto/CryptoChart";
import { ThemeToggle } from "./features/ThemeToggle";
import { ClientSocketConnection } from "@/app/shared/components/client-socket-connection/ClientSocketConnection";
import styles from "./page.module.css";

export default function CryptoPage() {
  return (
    <ClientSocketConnection>
      <div className={styles.page}>
        <div className={styles.bgBase} aria-hidden />
        <div className={`${styles.grid3dWave} grid-3d-wave`} aria-hidden />
        <div className={styles.particle1} aria-hidden />
        <div className={styles.particle2} aria-hidden />
        <Header />
        {/*<ThemeToggle />*/}

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>Avantim</h1>
            <p className={styles.subtitle}>
              Отслеживание криптовалют в реальном времени
            </p>
          </div>

          <CryptoChart />
        </main>
      </div>
    </ClientSocketConnection>
  );
}
