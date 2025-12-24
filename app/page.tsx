import { Header } from "@widgets/Header";
import { CryptoChart } from "@widgets/crypto/CryptoChart";
import styles from "./page.module.css";

export default function CryptoPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crypto Monitor</h1>
          <p className={styles.subtitle}>
            Отслеживание криптовалют в реальном времени
          </p>
        </div>

        <CryptoChart />
      </main>
    </div>
  );
}
