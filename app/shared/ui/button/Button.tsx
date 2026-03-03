import { forwardRef } from "react";
import type React from "react";
import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";

interface ButtonProps extends Omit<ChakraButtonProps, "variant" | "size"> {
  variant?: "tab" | "primary" | "outline" | "ghost";
  isActive?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isActive = false, children, ...props }, ref) => {
    // Стили для варианта "tab"
    const tabStyles = {
      flex: "1",
      px: "1rem",
      py: "0.75rem",
      bg: isActive ? "var(--card-bg)" : "transparent",
      borderRadius: "8px",
      color: isActive ? "var(--primary)" : "var(--foreground-muted)",
      fontSize: "0.95rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      position: "relative" as const,
      boxShadow: isActive ? "0 2px 8px rgba(0, 0, 0, 0.08)" : "none",
      _hover: {
        color: "var(--primary)",
        bg: "var(--card-bg)",
      },
    };

    // Стили для варианта "primary" (submit кнопки) - LLMStart style
    const primaryStyles = {
      px: "1.5rem",
      py: "1rem",
      bg: "var(--primary-gradient)",
      borderRadius: "12px",
      color: "#0a0a0f",
      fontSize: "1rem",
      fontWeight: "700",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 4px 20px rgba(6, 255, 165, 0.3)",
      position: "relative" as const,
      overflow: "hidden",
      border: "1px solid rgba(6, 255, 165, 0.2)",
      _hover: {
        transform: "translateY(-2px) scale(1.02)",
        boxShadow: "0 8px 30px rgba(6, 255, 165, 0.4)",
      },
      _active: {
        transform: "translateY(0)",
        boxShadow: "0 2px 12px rgba(6, 255, 165, 0.25)",
      },
      _disabled: {
        opacity: 0.6,
        cursor: "not-allowed",
        transform: "none",
        boxShadow: "0 2px 8px rgba(6, 255, 165, 0.15)",
        _hover: {
          transform: "none",
          boxShadow: "0 2px 8px rgba(6, 255, 165, 0.15)",
        },
      },
    };

    // Стили для варианта "outline" - LLMStart style
    const outlineStyles = {
      px: "1rem",
      py: "0.75rem",
      bg: "transparent",
      border: "1px solid var(--card-border)",
      borderRadius: "12px",
      color: "var(--foreground)",
      fontSize: "0.95rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      _hover: {
        bg: "var(--accent-muted)",
        borderColor: "var(--accent-border)",
        color: "var(--accent)",
      },
    };

    // Стили для варианта "ghost"
    const ghostStyles = {
      px: "1rem",
      py: "0.75rem",
      bg: "transparent",
      color: "var(--foreground)",
      fontSize: "0.95rem",
      fontWeight: "600",
      transition: "all 0.2s ease",
      _hover: {
        bg: "var(--input-bg)",
        color: "var(--primary)",
      },
    };

    // Выбираем стили в зависимости от варианта
    const getVariantStyles = () => {
      switch (variant) {
        case "tab":
          return tabStyles;
        case "primary":
          return primaryStyles;
        case "outline":
          return outlineStyles;
        case "ghost":
          return ghostStyles;
        default:
          return primaryStyles;
      }
    };

    return (
      <ChakraButton ref={ref} {...getVariantStyles()} {...props}>
        {children}
      </ChakraButton>
    );
  }
);

Button.displayName = "Button";
