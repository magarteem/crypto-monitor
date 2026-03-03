"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { OAuthButtons } from "@features/oauthButtons";
import styles from "./auth.module.scss";
import { RouteNames } from "@sharedTypes/RouteNames";
import { PageTitle } from "@/app/shared/components/pageTitle/PageTitle";
import { AuthFormLayout } from "@/app/shared/layouts/authFormLayout/AuthFormLayout";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [globalError, setGlobalError] = useState("");

  const handleGoogleAuth = async () => {
    try {
      await signIn("google", { callbackUrl: RouteNames.HOME });
    } catch (error) {
      setGlobalError("Ошибка авторизации через Google");
    }
  };

  const handleFacebookAuth = () => {
    // TODO: Интеграция с Facebook OAuth
    setGlobalError("Facebook авторизация в разработке");
  };

  const handleMetaMaskAuth = () => {
    // TODO: Интеграция с MetaMask
    setGlobalError("MetaMask авторизация в разработке");
  };

  const handleWalletConnectAuth = () => {
    // TODO: Интеграция с WalletConnect
    setGlobalError("WalletConnect авторизация в разработке");
  };

  const handleXTwitterAuth = () => {
    // TODO: Интеграция с X (Twitter) OAuth
    setGlobalError("X (Twitter) авторизация в разработке");
  };

  const handleTelegramAuth = () => {
    // TODO: Интеграция с Telegram OAuth
    setGlobalError("Telegram авторизация в разработке");
  };

  return (
    <>
      {/* Header Section */}
      <PageTitle title="Avantim" subtitle="Отслеживание криптовалют в реальном времени" />

      {/* Auth Card */}
      <AuthFormLayout>
        {/* OAuth Buttons */}
        {globalError && <div className={styles.errorMessage}>{globalError}</div>}
        <OAuthButtons
          onGoogleClick={handleGoogleAuth}
          onFacebookClick={handleFacebookAuth}
          onXTwitterClick={handleXTwitterAuth}
          onMetaMaskClick={handleMetaMaskAuth}
          onWalletConnectClick={handleWalletConnectAuth}
          onTelegramClick={handleTelegramAuth}
        />

        <div className={styles.divider}>
          <span className={styles.dividerText}>или</span>
        </div>

        {/* Children - формы логина или регистрации */}
        {children}
      </AuthFormLayout>
    </>
  );
};
