"use client";

import { Header } from "@widgets/Header";
import {
  MultiChartsIcon,
  ClockIcon,
  ChartLineIcon,
  LocationIcon,
  GridIcon,
  SecurityIcon,
} from "@/public/img";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>О сервисе</h1>
          <p className={styles.subtitle}>
            Мощный инструмент для отслеживания криптовалют в реальном времени
          </p>
        </div>

        <div className={styles.content}>
          {/* Основное описание */}
          <section className={styles.section}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Что такое Crypto Monitor?</h2>
              <p className={styles.text}>
                Crypto Monitor — это современная платформа для мониторинга и
                анализа криптовалютных рынков в режиме реального времени. Мы
                предоставляем профессиональные инструменты для отслеживания цен,
                анализа графиков и принятия обоснованных торговых решений.
              </p>
              <p className={styles.text}>
                Наш сервис позволяет одновременно отслеживать множество
                криптовалют, получать уведомления о значительных изменениях цен
                и анализировать рыночные тренды с помощью интерактивных
                графиков.
              </p>
            </div>
          </section>

          {/* Основные возможности */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Основные возможности</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <MultiChartsIcon width="48" height="48" />
                </div>
                <h3 className={styles.featureTitle}>Множественные графики</h3>
                <p className={styles.featureText}>
                  Отслеживайте несколько криптовалют одновременно с
                  настраиваемым количеством колонок и размером графиков
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <ClockIcon width="48" height="48" />
                </div>
                <h3 className={styles.featureTitle}>
                  Обновления в реальном времени
                </h3>
                <p className={styles.featureText}>
                  Данные обновляются мгновенно через WebSocket соединения с
                  биржами, обеспечивая актуальную информацию о ценах
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <ChartLineIcon width="48" height="48" />
                </div>
                <h3 className={styles.featureTitle}>Интерактивные графики</h3>
                <p className={styles.featureText}>
                  Профессиональные свечные графики с возможностью изменения
                  таймфреймов и бесконечной прокруткой исторических данных
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <LocationIcon width="48" height="48" />
                </div>
                <h3 className={styles.featureTitle}>Уведомления о ценах</h3>
                <p className={styles.featureText}>
                  Настраивайте уведомления для отслеживания значительных
                  изменений цен ваших любимых криптовалют
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <GridIcon width="48" height="48" />
                </div>
                <h3 className={styles.featureTitle}>Гибкая настройка</h3>
                <p className={styles.featureText}>
                  Настройте интерфейс под свои нужды: выберите количество
                  колонок, размер графиков и отслеживаемые активы
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <SecurityIcon width="48" height="48" />
                </div>
                <h3 className={styles.featureTitle}>Безопасность</h3>
                <p className={styles.featureText}>
                  Все данные защищены современными методами шифрования. Мы не
                  храним ваши персональные финансовые данные
                </p>
              </div>
            </div>
          </section>

          {/* Технологии */}
          <section className={styles.section}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Технологии</h2>
              <p className={styles.text}>
                Crypto Monitor построен на современных технологиях
                веб-разработки:
              </p>
              <ul className={styles.techList}>
                <li className={styles.techItem}>
                  <span className={styles.techName}>Next.js</span> — фреймворк
                  для создания высокопроизводительных React-приложений
                </li>
                <li className={styles.techItem}>
                  <span className={styles.techName}>Lightweight Charts</span> —
                  библиотека для создания интерактивных финансовых графиков
                </li>
                <li className={styles.techItem}>
                  <span className={styles.techName}>Binance API</span> —
                  интеграция с крупнейшей криптовалютной биржей для получения
                  актуальных данных
                </li>
                <li className={styles.techItem}>
                  <span className={styles.techName}>WebSocket</span> — протокол
                  для получения данных в реальном времени без задержек
                </li>
                <li className={styles.techItem}>
                  <span className={styles.techName}>TypeScript</span> — язык
                  программирования для обеспечения типобезопасности кода
                </li>
              </ul>
            </div>
          </section>

          {/* Контакты и поддержка */}
          <section className={styles.section}>
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Поддержка</h2>
              <p className={styles.text}>
                Если у вас возникли вопросы или проблемы, мы всегда готовы
                помочь. Вы можете связаться с нашей службой поддержки через
                раздел настроек в вашем профиле.
              </p>
              <p className={styles.text}>
                Мы постоянно работаем над улучшением сервиса и добавляем новые
                функции. Следите за обновлениями!
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
