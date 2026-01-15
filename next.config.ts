// next.config.ts
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "public/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Явно указываем пустой turbopack конфиг, так как Serwist использует webpack
  turbopack: {},
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  env: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  webpack(config) {
    // Настройка SVGR для импорта SVG как React компонентов
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default withSerwist(nextConfig);
