"use client";

import { useState } from "react";
import { GoBack } from "@features/goBack";
import { CheckmarkIcon } from "@/public/img";
import styles from "./page.module.css";

type BillingPeriod = "monthly" | "yearly";

export default function TariffsPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const getTariffs = (period: BillingPeriod) => [
    {
      name: "Free",
      priceMonthly: 0,
      priceYearly: 0,
      features: [
        "До 3 отслеживаемых монет",
        "Обновление каждые 15 минут",
        "До 100 уведомлений в месяц",
        "Единый % изменения для всех монет",
        "Базовая аналитика",
      ],
      recommended: false,
    },
    {
      name: "Medium",
      priceMonthly: 9.99,
      priceYearly: 99.99,
      features: [
        "До 10 отслеживаемых монет",
        "Обновление каждую минуту",
        "До 500 уведомлений в месяц",
        "Индивидуальный % для каждой монеты",
        "Расширенная аналитика",
        "Уведомления в Telegram",
      ],
      recommended: true,
    },
    {
      name: "Pro",
      priceMonthly: 29.99,
      priceYearly: 299.99,
      features: [
        "До 100 отслеживаемых монет",
        "Обновление каждую минуту",
        "Безлимитные уведомления",
        "Индивидуальный % для каждой монеты",
        "Продвинутая аналитика",
        "Приоритетная поддержка 24/7",
        "API доступ",
      ],
      recommended: false,
    },
  ];

  const tariffs = getTariffs(billingPeriod);

  const getPrice = (tariff: typeof tariffs[0]) => {
    if (tariff.priceMonthly === 0) return "Бесплатно";
    const price = billingPeriod === "monthly" ? tariff.priceMonthly : tariff.priceYearly;
    return `$${price}`;
  };

  const getPeriod = (tariff: typeof tariffs[0]) => {
    if (tariff.priceMonthly === 0) return "";
    return billingPeriod === "monthly" ? "/месяц" : "/год";
  };

  const getSavings = (tariff: typeof tariffs[0]) => {
    if (tariff.priceMonthly === 0 || billingPeriod === "monthly") return null;
    const monthlyCost = tariff.priceMonthly * 12;
    const savings = Math.round(((monthlyCost - tariff.priceYearly) / monthlyCost) * 100);
    return savings > 0 ? savings : null;
  };

  return (
    <div className={styles.page}>
      <GoBack />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Тарифные планы</h1>
          <p className={styles.subtitle}>
            Выберите план, который подходит именно вам
          </p>

          {/* Billing Period Toggle */}
          <div className={styles.billingToggle}>
            <button
              className={`${styles.toggleButton} ${
                billingPeriod === "monthly" ? styles.active : ""
              }`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Ежемесячно
            </button>
            <button
              className={`${styles.toggleButton} ${
                billingPeriod === "yearly" ? styles.active : ""
              }`}
              onClick={() => setBillingPeriod("yearly")}
            >
              Ежегодно
              <span className={styles.saveBadge}>Экономия до 17%</span>
            </button>
          </div>
        </div>

        <div className={styles.tariffsGrid}>
          {tariffs.map((tariff) => {
            const savings = getSavings(tariff);
            return (
              <div
                key={tariff.name}
                className={`${styles.tariffCard} ${
                  tariff.recommended ? styles.recommended : ""
                }`}
              >
                {tariff.recommended && (
                  <div className={styles.badge}>Рекомендуем</div>
                )}
                {savings && (
                  <div className={styles.savingsBadge}>
                    Экономия {savings}%
                  </div>
                )}

                <h3 className={styles.tariffName}>{tariff.name}</h3>

                <div className={styles.priceSection}>
                  <span className={styles.price}>{getPrice(tariff)}</span>
                  {getPeriod(tariff) && (
                    <span className={styles.period}>{getPeriod(tariff)}</span>
                  )}
                </div>

                <ul className={styles.featuresList}>
                  {tariff.features.map((feature, index) => (
                    <li key={index} className={styles.feature}>
                      <CheckmarkIcon width="20" height="20" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={styles.selectButton}>
                  {tariff.priceMonthly === 0 ? "Начать бесплатно" : "Выбрать план"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment Info */}
        <div className={styles.paymentInfo}>
          <h3 className={styles.paymentTitle}>Оплата</h3>
          <p className={styles.paymentText}>
            Принимаем оплату в <strong>USDT</strong> на крипто-кошелек
          </p>
          <p className={styles.paymentNote}>
            💡 При окончании подписки без оплаты тариф автоматически переходит на Free
          </p>
        </div>
      </main>
    </div>
  );
}
