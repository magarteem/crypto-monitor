import { Header } from "@widgets/Header";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Crypto Monitor</h1>
            <p className={styles.heroSubtitle}>
              Fair, Community Driven, Cryptocurrency Lottery
            </p>
            <div className={styles.heroBadge}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17l10 5 10-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12l10 5 10-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Powered by Blockchain
            </div>
            <div className={styles.heroButtons}>
              <button type="button" className={styles.playButton}>
                <span className={styles.playIcon}>▶</span>
                Play Now
              </button>
              <button type="button" className={styles.paperButton}>
                <span className={styles.paperIcon}>📄</span>
                White Paper
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <div className={styles.featureIconBg}>⚖️</div>
              <svg
                className={styles.featureDecor}
                width="100"
                height="100"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient1)"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                />
              </svg>
            </div>
            <h2 className={styles.featureTitle}>Fair Play</h2>
            <p className={styles.featureDescription}>
              Chancey leverages blockchain technology to ensure transparent,
              fair play in every draw. It&apos;s not just a game, but a platform
              where integrity is as vital as the thrill of winning.
            </p>
            <p className={styles.featureSubtext}>
              Participants can confidently trust in the fair distribution of
              winnings, backed by clear, trackable records of fund management.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <div className={styles.featureIconBg}>🏆</div>
              <svg
                className={styles.featureDecor}
                width="100"
                height="100"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient2)"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                />
              </svg>
            </div>
            <h2 className={styles.featureTitle}>Big Prizes</h2>
            <p className={styles.featureDescription}>
              Win big with our community-driven lottery system. Every ticket
              brings prizes and power!
            </p>
          </div>
        </section>
      </main>

      {/* SVG Gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b4a" />
            <stop offset="100%" stopColor="#ff8c42" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b4a" />
            <stop offset="100%" stopColor="#ff8c42" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
