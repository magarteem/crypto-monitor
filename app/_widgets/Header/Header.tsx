"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

interface HeaderProps {
  userEmail?: string;
  onProfileClick?: () => void;
}

export const Header = ({
  userEmail = "ivan@example.com",
  onProfileClick,
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

        {/* Profile Button */}
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
      </div>
    </header>
  );
};
