"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  ModalConfig,
  ModalId,
  ModalContextValue,
} from "@sharedTypes/modal";

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: ModalConfig) => {
    setModals((prev) => {
      if (prev.some((m) => m.id === config.id)) {
        return prev;
      }
      return [...prev, config];
    });
  }, []);

  const closeModal = useCallback((id: ModalId) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const isOpen = useCallback(
    (id: ModalId) => modals.some((m) => m.id === id),
    [modals]
  );

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        closeAllModals,
        isOpen,
        modals,
      }}
    >
      {children}
      <ModalRenderer modals={modals} onClose={closeModal} />
    </ModalContext.Provider>
  );
}

function ModalRenderer({
  modals,
  onClose,
}: {
  modals: ModalConfig[];
  onClose: (id: ModalId) => void;
}) {
  return (
    <>
      {modals.map((modal) => {
        const ModalComponent = modal.component;
        return (
          <ModalComponent
            key={modal.id}
            isOpen={true}
            onClose={() => onClose(modal.id)}
            {...modal.props}
            closeOnOverlayClick={modal.closeOnOverlayClick ?? true}
            closeOnEscape={modal.closeOnEscape ?? true}
            size={modal.size ?? "md"}
            placement={modal.placement ?? "center"}
          />
        );
      })}
    </>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within ModalProvider");
  }
  return context;
}
