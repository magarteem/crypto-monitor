"use client";

import React, { useEffect } from "react";
import { Dialog, Portal, Box, Flex, Text } from "@chakra-ui/react";
import styles from "./Modal.module.css";
import { XIcon } from "@/public/img";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  placement?: "center" | "top" | "bottom";
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = "md",
  placement = "center",
  showCloseButton = true,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => {
      if (!e.open && closeOnOverlayClick) {
        onClose();
      }
    }}>
      <Portal>
        <Dialog.Backdrop 
          className={styles.backdrop}
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <Dialog.Positioner 
          className={`${styles.positioner} ${styles[placement]}`}
        >
          <Dialog.Content 
            className={`${styles.modal} ${styles[size]} ${className || ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <Flex className={styles.header} justify="space-between" align="center">
                {title && (
                  <Text className={styles.title}>{title}</Text>
                )}
                {showCloseButton && (
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Закрыть"
                  >
                    <XIcon width="20" height="20" />
                  </button>
                )}
              </Flex>
            )}

            <Box className={styles.body}>
              {children}
            </Box>

            {footer && (
              <Flex className={styles.footer} justify="flex-end" gap="0.75rem">
                {footer}
              </Flex>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
