"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, VStack, Text } from "@chakra-ui/react";
import { Modal } from "@ui/modal";
import { Button } from "@ui/button";
import { InputFormField } from "@/app/shared/formFields/inputFormField/InputFormField";
import { useSession } from "next-auth/react";
import { editProfileSchema, type EditProfileFormData } from "./schemas";
import { UserIcon } from "@/public/img";
import styles from "./EditProfileModal.module.css";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { data: session } = useSession();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      avatar: undefined,
    },
  });

  // Обновляем форму при изменении session
  useEffect(() => {
    if (session?.user?.name && isOpen) {
      form.reset({
        name: session.user.name,
        avatar: undefined,
      });
      setAvatarPreview(null);
    }
  }, [session?.user?.name, isOpen, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверяем размер файла
      if (file.size > 5 * 1024 * 1024) {
        form.setError("avatar", {
          type: "manual",
          message: "Размер файла не должен превышать 5MB",
        });
        return;
      }

      // Проверяем тип файла
      if (!file.type.startsWith("image/")) {
        form.setError("avatar", {
          type: "manual",
          message: "Файл должен быть изображением",
        });
        return;
      }

      form.setValue("avatar", file, { shouldValidate: true });
      form.clearErrors("avatar");

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    form.setValue("avatar", undefined);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: EditProfileFormData) => {
    const formData = {
      name: data.name,
      email: session?.user?.email || "",
      avatar: data.avatar
        ? {
            name: data.avatar.name,
            size: data.avatar.size,
            type: data.avatar.type,
            lastModified: data.avatar.lastModified,
          }
        : null,
    };

    console.log("Profile data to save:", formData);
    console.log("Avatar file:", data.avatar);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать профиль"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={form.handleSubmit(onSubmit)}>
            Сохранить
          </Button>
        </>
      }
    >
      <VStack gap="2rem" align="stretch">
        {/* Avatar Upload Section */}
        <Box className={styles.avatarSection}>
          <Text className={styles.avatarLabel}>Аватар</Text>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarPreview}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" />
              ) : (
                <UserIcon width="48" height="48" />
              )}
            </div>
            <div className={styles.avatarActions}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.fileInput}
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className={styles.uploadButton}>
                Загрузить фото
              </label>
              {avatarPreview && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={handleRemoveAvatar}
                >
                  Удалить
                </button>
              )}
            </div>
            {form.formState.errors.avatar && (
              <Text className={styles.errorText}>
                {form.formState.errors.avatar.message}
              </Text>
            )}
          </div>
        </Box>

        {/* Name Field */}
        <InputFormField
          form={form}
          name="name"
          placeholder="Введите ваше имя"
          title="Имя"
        />

        {/* Email Field (Read-only) */}
        <Box>
          <Text className={styles.label}>Email</Text>
          <input
            type="email"
            value={session?.user?.email || ""}
            disabled
            className={styles.disabledInput}
          />
          <Text className={styles.hint}>Email нельзя изменить</Text>
        </Box>
      </VStack>
    </Modal>
  );
}
