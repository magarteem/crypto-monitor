"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import styles from "./ProfileSidebar.module.css";
import { CRYPTO_COINS } from "@/app/shared/const/cryptoConst";
import {
  EditIcon,
  UserIcon,
  ChartBarIcon,
  FeedbackIcon,
  SettingsIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XIcon,
} from "@/public/img";
import { useModal } from "@hooks/useModal";
import { EditProfileModal } from "../modals/EditProfileModal";
import { FeedbackModal } from "../modals/FeedbackModal";
import { RouteNames } from "@sharedTypes/RouteNames";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSidebar = ({ isOpen, onClose }: ProfileSidebarProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { openModal } = useModal();
  const [isSubscriptionExpanded, setIsSubscriptionExpanded] = useState(false);
  const [isStatisticsExpanded, setIsStatisticsExpanded] = useState(false);

  // Тариф пользователя (пока хардкодим FREE)
  const userTariff = "FREE";

  const handleDisconnect = async () => {
    await signOut({ redirect: false });
    onClose();
    router.push("/");
  };

  const handleEditProfile = () => {
    openModal("edit-profile", EditProfileModal);
  };

  const handleFeedback = () => {
    openModal("feedback", FeedbackModal);
  };

  const toggleSubscription = () => {
    setIsSubscriptionExpanded((prev) => !prev);
  };

  const toggleStatistics = () => {
    setIsStatisticsExpanded((prev) => !prev);
  };

  const userEmail = session?.user?.email || "Не авторизован";
  const userName = session?.user?.name || "Пользователь";

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.visible : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        {/* Header */}
        <div className={styles.header}>
          <Text className={styles.title}>Профиль</Text>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть профиль"
          >
            <XIcon width="20" height="20" />
          </button>
        </div>

        {/* User Info Card */}
        <div className={styles.userInfoCard}>
          <div className={styles.userAvatar}>
            <UserIcon width="24" height="24" />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.userEmail}>{userEmail}</div>
          </div>
          <button
            type="button"
            className={styles.editButton}
            onClick={handleEditProfile}
            aria-label="Редактировать профиль"
          >
            <EditIcon width="16" height="16" />
          </button>
        </div>

        {/* Subscription Management Accordion */}
        <Box
          className={`${styles.accordionItem} ${
            isSubscriptionExpanded ? styles.expanded : ""
          }`}
        >
          <button
            type="button"
            className={styles.accordionHeader}
            onClick={toggleSubscription}
          >
            <HStack gap="0.625rem">
              <SettingsIcon
                width="20"
                height="20"
                className={styles.sectionIcon}
              />
              <Text className={styles.accordionTitle}>
                Управление подпиской
              </Text>
            </HStack>
            {isSubscriptionExpanded ? (
              <ChevronUpIcon width="20" height="20" />
            ) : (
              <ChevronDownIcon width="20" height="20" />
            )}
          </button>
          <Box className={styles.accordionContent}>
            {isSubscriptionExpanded && (
              <Box className={styles.accordionContentInner}>
                <VStack gap="1rem" align="stretch">
                  <Text className={styles.subscriptionText}>
                    У тебя подписка{" "}
                    <span className={styles.freeHighlight}>FREE</span>.
                  </Text>
                  <Text className={styles.subscriptionText}>
                    Ты можешь выбрать до 3х монет для отслеживания
                  </Text>
                  <Text className={styles.subscriptionText}>
                    Лимит - 10 уведомлений в месяц
                  </Text>
                  <Text className={styles.subscriptionText}>
                    Обновление не чаще одного раза в 15 минут
                  </Text>
                  <Link
                    href={RouteNames.TARIFFS}
                    className={styles.upgradePlanButton}
                  >
                    Upgrade Plan
                  </Link>
                  <button
                    type="button"
                    className={styles.unsubscribeButton}
                    onClick={() => {
                      // TODO: Реализовать отписку
                      console.log("Отписка от подписки");
                    }}
                  >
                    Отписаться
                  </button>
                </VStack>
              </Box>
            )}
          </Box>
        </Box>

        {/* Statistics Accordion */}
        <Box
          className={`${styles.accordionItem} ${
            isStatisticsExpanded ? styles.expanded : ""
          }`}
        >
          <button
            type="button"
            className={styles.accordionHeader}
            onClick={toggleStatistics}
          >
            <HStack gap="0.625rem">
              <ChartBarIcon
                width="20"
                height="20"
                className={styles.sectionIcon}
              />
              <Text className={styles.accordionTitle}>Статистика</Text>
            </HStack>
            {isStatisticsExpanded ? (
              <ChevronUpIcon width="20" height="20" />
            ) : (
              <ChevronDownIcon width="20" height="20" />
            )}
          </button>
          <Box className={styles.accordionContent}>
            {isStatisticsExpanded && (
              <Box className={styles.accordionContentInner}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ChartBarIcon width="20" height="20" />
                  </div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{CRYPTO_COINS.length}</div>
                    <div className={styles.statLabel}>
                      Отслеживаемых монет
                    </div>
                  </div>
                </div>
                <div className={styles.coinsPreview}>
                  <div className={styles.coinsPreviewLabel}>
                    Отслеживаемые:
                  </div>
                  <div className={styles.coinsList}>
                    {CRYPTO_COINS.slice(0, 6).map((coin) => (
                      <span key={coin.symbol} className={styles.coinTag}>
                        {coin.name.split("/")[0]}
                      </span>
                    ))}
                    {CRYPTO_COINS.length > 6 && (
                      <span className={styles.coinTag}>
                        +{CRYPTO_COINS.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              </Box>
            )}
          </Box>
        </Box>

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          {/* Feedback Button */}
          <button
            type="button"
            className={styles.feedbackButton}
            onClick={handleFeedback}
          >
            <FeedbackIcon width="18" height="18" />
            Обратная связь
          </button>

          {/* Disconnect Button */}
          <button
            type="button"
            className={styles.disconnectButton}
            onClick={handleDisconnect}
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </>
  );
};
