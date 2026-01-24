"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./Header.module.css";
import { RouteNames } from "@sharedTypes/RouteNames";
import { ProfileSidebar } from "../ProfileSidebar";
import { SettingsSidebar } from "../SettingsSidebar";
import { useState, useEffect } from "react";
import LogoIcon from "@/public/img/logo.svg";
import { BellIcon } from "@/public/img";
import { Tooltip } from "@/app/shared/components/toolTip/ToolTip";
import { useFindProfile } from "@/app/shared/api/generated/user/user";

export const Header = () => {
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: userProfile } = useFindProfile({
    query: {
      enabled: !!session?.user?.id,
    },
  });

  console.log("userProfile ======", userProfile);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <LogoIcon width="40" height="40" className={styles.logoIcon} />
            <span className={styles.logoText}>Crypto Monitor</span>
          </Link>

          {/* Navigation */}
          <nav className={styles.nav}>
            {session?.user && <Link href={RouteNames.DASHBOARD} className={styles.navLink}>
              Dashboard
            </Link>}
            <Link href={RouteNames.TARIFFS} className={styles.navLink}>
              Tariffs
            </Link>
            <Link href={RouteNames.ABOUT} className={styles.navLink}>
              About
            </Link>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {status === "loading" ? (
              <div className={styles.loader} aria-label="Загрузка">
                <div className={styles.spinner} />
              </div>
            ) : status === "authenticated" && session ? (
              <>
                <button
                  type="button"
                  className={styles.profileButton}
                  onClick={() => setIsProfileOpen(true)}
                >
                  <span className={styles.profileEmail}>
                    {userProfile?.email}
                  </span>
                  |
                  <Tooltip
                    showArrow
                    content={userProfile?.selectedPlan?.name || "FREE"}
                    contentProps={{ css: { "--tooltip-bg": "var(--success)" } }}
                  >
                    <span className={styles.profileNetwork}>{userProfile?.selectedPlan?.name || "FREE"}</span>
                  </Tooltip>
                </button>

                <button
                  type="button"
                  className={styles.settingsButton}
                  onClick={() => setIsSettingsOpen(true)}
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
              </>
            ) : (
              <Link href="/auth" className={styles.loginButton}>
                <BellIcon width="18" height="18" />
                Настроить уведомления
              </Link>
            )}
          </div>
        </div>
      </header>

      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
