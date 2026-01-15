"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, VStack, Text } from "@chakra-ui/react";
import { Modal } from "@ui/modal";
import { Button } from "@ui/button";
import { useSession } from "next-auth/react";
import { feedbackSchema, type FeedbackFormData } from "./schemas";
import styles from "./FeedbackModal.module.css";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { data: session } = useSession();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: session?.user?.email || "",
      message: "",
    },
  });

  // Обновляем email при изменении session
  useEffect(() => {
    if (session?.user?.email && isOpen) {
      form.reset({
        email: session.user.email,
        message: "",
      });
    }
  }, [session?.user?.email, isOpen, form]);

  const onSubmit = (data: FeedbackFormData) => {
    // Заглушка: выводим данные в консоль
    console.log("Feedback data:", {
      email: data.email,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // Заглушка для отправки на email
    console.log("Sending email to: admin@example.com");
    console.log("Email content:", {
      from: data.email,
      subject: "Обратная связь от пользователя",
      body: data.message,
    });

    // Заглушка для отправки в Telegram
    console.log("Sending to Telegram bot");
    console.log("Telegram message:", {
      text: `Обратная связь от ${data.email}:\n\n${data.message}`,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Обратная связь"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={form.handleSubmit(onSubmit)}>
            Отправить
          </Button>
        </>
      }
    >
      <VStack gap="1.5rem" align="stretch">
        {/* Email Field (Read-only if logged in) */}
        <Box>
          <Text className={styles.label}>Email</Text>
          <input
            type="email"
            {...form.register("email")}
            disabled={!!session?.user?.email}
            className={`${styles.input} ${
              session?.user?.email ? styles.disabledInput : ""
            }`}
            placeholder="your@email.com"
          />
          {form.formState.errors.email && (
            <Text className={styles.errorText}>
              {form.formState.errors.email.message}
            </Text>
          )}
        </Box>

        {/* Message Field */}
        <Box>
          <Text className={styles.label}>Сообщение</Text>
          <textarea
            {...form.register("message")}
            className={styles.textarea}
            placeholder="Введите ваше сообщение..."
            rows={6}
          />
          {form.formState.errors.message && (
            <Text className={styles.errorText}>
              {form.formState.errors.message.message}
            </Text>
          )}
          <Text className={styles.hint}>
            Минимум 10 символов. Максимум 2000 символов.
          </Text>
        </Box>
      </VStack>
    </Modal>
  );
}
