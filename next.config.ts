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
};

export default withSerwist(nextConfig);
