import type React from "react";

export type ModalId = 
  | "edit-profile"
  | "feedback"
  | "confirm-action"
  | "tariff-upgrade"
  | string;

export interface ModalConfig {
  id: ModalId;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  placement?: "center" | "top" | "bottom";
}

export interface ModalContextValue {
  openModal: (config: ModalConfig) => void;
  closeModal: (id: ModalId) => void;
  closeAllModals: () => void;
  isOpen: (id: ModalId) => boolean;
  modals: ModalConfig[];
}
