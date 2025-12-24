"use client";

import { useRouter } from "next/navigation";
import styles from "./ProfileSidebar.module.css";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onDisconnect?: () => void;
  userEmail?: string;
  userName?: string;
}

export const ProfileSidebar = ({
  isOpen,
  onClose,
  onDisconnect,
  userEmail = "ivan@example.com",
  userName = "Ivan (Test User)",
}: ProfileSidebarProps) => {
  const router = useRouter();

  const handleDisconnect = () => {
    if (onDisconnect) {
      document.cookie =
        "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/auth");
    } else {
      // Удаляем cookie и редиректим
      document.cookie = "auth_token=; path=/; max-age=0";
      router.push("/auth");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        {/* User Info */}
        <div className={styles.userInfo}>
          <div className={styles.userEmail}>{userEmail}</div>
          <div className={styles.userNetwork}>Base Sepolia</div>
          <div className={styles.userName}>{userName}</div>
        </div>

        {/* Wallet Balances */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Wallet Balances</h3>
          <div className={styles.balanceItem}>
            <div className={styles.balanceIcon}>C</div>
            <div className={styles.balanceAmount}>0.0</div>
          </div>
          <div className={styles.balanceItem}>
            <div className={styles.balanceIconDiamond}>◆</div>
            <div className={styles.balanceAmount}>0.0</div>
          </div>
        </div>

        {/* Redeem Section */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Redeem your CHANCEY</h3>
          <button type="button" className={styles.redeemButton}>
            <span className={styles.redeemIcon}>🎫</span>
            <span>Free Tickets</span>
          </button>
          <button type="button" className={styles.redeemButton}>
            <span className={styles.redeemIcon}>💎</span>
            <span>Pot Claim</span>
          </button>
        </div>

        {/* Disconnect Button */}
        <button
          type="button"
          className={styles.disconnectButton}
          onClick={handleDisconnect}
        >
          DISCONNECT
        </button>
      </div>
    </>
  );
};
