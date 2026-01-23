"use client";

import {
  GoogleIcon,
  TelegramIcon,
  MetaMaskIcon,
  WalletConnectIcon,
  FacebookIcon,
  XTwitterIcon,
} from "@/public/img";
import styles from "./OAuthButtons.module.css";

interface OAuthButtonsProps {
  onGoogleClick: () => void;
  onTelegramClick: () => void;
  onMetaMaskClick: () => void;
  onWalletConnectClick: () => void;
  onFacebookClick: () => void;
  onXTwitterClick: () => void;
  className?: string;
}

export function OAuthButtons({
  onGoogleClick,
  onTelegramClick,
  onMetaMaskClick,
  onWalletConnectClick,
  onFacebookClick,
  onXTwitterClick,
  className,
}: OAuthButtonsProps) {
  return (
    <div className={`${styles.oauthButtons} ${className || ""}`}>
      <button
        type="button"
        className={styles.oauthButton}
        onClick={onGoogleClick}
      >
        <GoogleIcon className={styles.oauthIcon} />
        Google
      </button>
      <button
        type="button"
        className={styles.oauthButton}
        onClick={onTelegramClick}
      >
        <TelegramIcon className={styles.oauthIcon} />
        Telegram
      </button>
      <button
        type="button"
        className={styles.oauthButton}
        onClick={onFacebookClick}
      >
        <FacebookIcon className={styles.oauthIcon} />
        Facebook
      </button>
      <button
        type="button"
        className={styles.oauthButton}
        onClick={onXTwitterClick}
      >
        <XTwitterIcon className={styles.oauthIcon} />
        X
      </button>
      <button
        type="button"
        className={styles.oauthButton}
        onClick={onMetaMaskClick}
      >
        <MetaMaskIcon className={styles.oauthIcon} />
        MetaMask
      </button>
      <button
        type="button"
        className={styles.oauthButton}
        onClick={onWalletConnectClick}
      >
        <WalletConnectIcon className={styles.oauthIcon} />
        WalletConnect
      </button>

    </div>
  );
}
