"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import WebApp from "@twa-dev/sdk";
import {
  GoogleIcon,
  TelegramIcon,
  MetaMaskIcon,
  WalletConnectIcon,
  FacebookIcon,
  XTwitterIcon,
} from "@/public/img";
import styles from "./OAuthButtons.module.css";
import type { TelegramLoginOptions, TelegramUser } from "@/types/telegram-login";

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

  const [isTelegramScriptLoaded, setIsTelegramScriptLoaded] = useState(false);

  // Загрузка Telegram Login Widget скрипта
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Проверяем, загружен ли скрипт
    if (window.Telegram?.Login) {
      setIsTelegramScriptLoaded(true);
      return;
    }

    // Загружаем скрипт, если его нет
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.onload = () => {
      setIsTelegramScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Не удалось загрузить Telegram Login Widget скрипт");
    };
    document.head.appendChild(script);

    return () => {
      // Очистка при размонтировании
      const existingScript = document.querySelector(
        'script[src="https://telegram.org/js/telegram-widget.js?22"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const authTelegram = (): void => {
    if (typeof window === "undefined" || !window.Telegram?.Login) {
      console.error("Telegram Login API не доступен. Убедитесь, что скрипт загружен.");
      onTelegramClick();
      return;
    }

    const loginOptions: TelegramLoginOptions = {
      bot_id: process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID as string,
      request_access: "write",
      bot_username: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME as string,
      size: "large",
      auth_url:
        process.env.NEXT_PUBLIC_TELEGRAM_AUTH_URL as string
    };

    window.Telegram.Login.auth(
      loginOptions,
      (user: TelegramUser | false) => {
        if (user === false) {
          console.error("Telegram авторизация отменена или не удалась");
          onTelegramClick();
          return;
        }

        console.log("Telegram user:", user);
        handleTelegramUser(user);
      }
    );
  };

  const handleTelegramUser = async (user: TelegramUser): Promise<void> => {
    try {
      // Авторизуем через next-auth с использованием кастомного провайдера "telegram"
      const result = await signIn("telegram", {
        telegramData: JSON.stringify(user),
        redirect: false,
      });

      if (result?.ok) {
        // Редирект на главную после успешной авторизации
        window.location.href = "/";
      } else {
        console.error("Ошибка авторизации через Telegram:", result?.error);
        onTelegramClick();
      }
    } catch (error) {
      console.error("Ошибка обработки данных Telegram:", error);
      onTelegramClick();
    }
  };






  return (
    <div className={`${styles.oauthButtons} ${className || ""}`}>


      <button
        type="button"
        className={styles.oauthButton}
        onClick={authTelegram}
        disabled={!isTelegramScriptLoaded}
      >
        <TelegramIcon className={styles.oauthIcon} />
        Telegram
      </button>
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
