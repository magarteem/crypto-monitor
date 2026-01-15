import { Header } from "@widgets/Header";
import { CryptoChart } from "@widgets/crypto/CryptoChart";
import { ThemeToggle } from "./features/ThemeToggle";
import styles from "./page.module.css";
import GraphikV2Wrapper from "./widgets/graphikV2/GraphikV2Wrapper";

export default function CryptoPage() {
  return (
    <div className={styles.page}>
      <Header />
      {/*<ThemeToggle />*/}

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
