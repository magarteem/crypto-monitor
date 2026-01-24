"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { GoBack } from "@features/goBack";
import { OAuthButtons } from "@features/oauthButtons";
import styles from "./page.module.css";
import { RouteNames } from "../shared/types";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [globalError, setGlobalError] = useState("");

  // Параллакс эффект
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  // Редирект на главную, если пользователь уже авторизован
  useEffect(() => {
    if (status === "authenticated") {

      if (pathname === RouteNames.AUTH_REGISTRATION) {
        router.push(RouteNames.TARIFFS);
        return
      }
      router.push(RouteNames.HOME);
    }
  }, [status, router]);

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
    <div className={styles.page} onMouseMove={handleMouseMove}>
      <GoBack />
      <main
        className={styles.main}
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Crypto Monitor</h1>
          <p className={styles.subtitle}>
            Отслеживание криптовалют в реальном времени
          </p>
        </div>

        {/* Auth Card */}
        <div className={styles.card}>
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
        </div>
      </main>
    </div>
  );
}
