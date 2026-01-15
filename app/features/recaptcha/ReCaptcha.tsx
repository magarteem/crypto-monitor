"use client";

import { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./ReCaptcha.module.css";

interface ReCaptchaProps {
  onChange?: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
  theme?: "light" | "dark";
}

export const ReCaptcha = forwardRef<ReCAPTCHA, ReCaptchaProps>(
  ({ onChange, onExpired, onError, theme = "dark" }, ref) => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      console.warn("ReCAPTCHA site key is not configured");
      return null;
    }

    return (
      <div className={styles.recaptchaWrapper}>
        <ReCAPTCHA
          ref={ref}
          sitekey={siteKey}
          onChange={onChange}
          onExpired={onExpired}
          onErrored={onError}
          theme={theme}
          size="normal"
        />
      </div>
    );
  }
);

ReCaptcha.displayName = "ReCaptcha";
