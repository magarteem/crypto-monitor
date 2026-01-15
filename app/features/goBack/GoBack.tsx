"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/public/img";
import styles from "./goBack.module.css";

interface GoBackProps {
  href?: string;
  label?: string;
}

export function GoBack({ href = "/", label = "Назад" }: GoBackProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={styles.backButton}
      onClick={() => router.push(href)}
      aria-label="Вернуться на главную"
    >
      <ArrowLeftIcon width="20" height="20" />
      {label}
    </button>
  );
}
