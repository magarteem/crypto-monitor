"use client";

import Link from "next/link";
import styles from "./Header.module.css";

interface HeaderProps {
  userEmail?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export const Header = ({
  userEmail = "ivan@example.com",
  onProfileClick,
  onSettingsClick,
}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>C</div>
          <span className={styles.logoText}>Chancey</span>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Crypto
          </Link>
          <Link href="/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/dashboard/earn" className={styles.navLink}>
            Earn
          </Link>
          <Link href="/dashboard/govern" className={styles.navLink}>
            Govern
          </Link>
          <Link href="/dashboard/learn" className={styles.navLink}>
            Learn
          </Link>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            type="button"
            className={styles.profileButton}
            onClick={onProfileClick}
          >
            <span className={styles.profileEmail}>
              {userEmail.substring(0, 15)}...
            </span>
            <span className={styles.profileNetwork}>| Base Sepolia</span>
          </button>

          {onSettingsClick && (
            <button
              type="button"
              className={styles.settingsButton}
              onClick={onSettingsClick}
              aria-label="Открыть настройки"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ width: "20px", height: "20px" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
