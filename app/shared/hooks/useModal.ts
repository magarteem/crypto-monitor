import { useCallback } from "react";
import type React from "react";
import { useModalContext } from "@providers/ModalProvider";
import type { ModalId, ModalConfig } from "@sharedTypes/modal";

export function useModal() {
  const { openModal, closeModal, closeAllModals, isOpen } = useModalContext();

  const open = useCallback(
    <T extends Record<string, any> = {}>(
      id: ModalId,
      component: React.ComponentType<T>,
      props?: T,
      config?: Omit<ModalConfig, "id" | "component" | "props">
    ) => {
      openModal({
        id,
        component: component as React.ComponentType<any>,
        props,
        ...config,
      });
    },
    [openModal]
  );

  const close = useCallback(
    (id: ModalId) => {
      closeModal(id);
    },
    [closeModal]
  );

  const check = useCallback(
    (id: ModalId) => {
      return isOpen(id);
    },
    [isOpen]
  );

  return {
    openModal: open,
    closeModal: close,
    closeAllModals,
    isModalOpen: check,
  };
}
