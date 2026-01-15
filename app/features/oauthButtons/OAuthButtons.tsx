"use client";

import { GoogleIcon, TelegramIcon } from "@/public/img";
import styles from "./OAuthButtons.module.css";

interface OAuthButtonsProps {
  onGoogleClick: () => void;
  onTelegramClick: () => void;
  className?: string;
}

export function OAuthButtons({
  onGoogleClick,
  onTelegramClick,
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
    </div>
  );
}
