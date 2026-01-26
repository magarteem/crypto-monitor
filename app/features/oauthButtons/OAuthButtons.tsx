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


  const authTelegram = () => {
    console.log("authTelegram");
    window.Telegram.Login.auth(
      {
        //bot_username: "monitor_cra_bot",
        //size: "large",
        //auth_url: "https://53ef93b790e7.ngrok-free.app",
        bot_id: "8540508074",
        request_access: "write"
      },
      (user: any) => {
        console.log("user", user);
      }
    );
  };
  return (
    <div className={`${styles.oauthButtons} ${className || ""}`}>
      {/*<div id="telegram-login">
        <script async
          src="https://telegram.org/js/telegram-widget.js?22"
        //data-telegram-login="monitor_cra_bot" data-size="large"
        //data-auth-url="53ef93b790e7.ngrok-free.app"
        //data-request-access="write"
        ></script>
        <div onClick={() => authTelegram()}>Click</div>
      </div>*/}

      <button
        id="telegram-login"
        type="button"
        className={styles.oauthButton}
        onClick={authTelegram}
      > <script async
        src="https://telegram.org/js/telegram-widget.js?22"
      //data-telegram-login="monitor_cra_bot" data-size="large"
      //data-auth-url="53ef93b790e7.ngrok-free.app"
      //data-request-access="write"
      ></script>

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
