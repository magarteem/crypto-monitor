// Binance API
export {
  fetchTicker24hr,
  fetchTickers24hr,
  fetchKlines,
  fetchCurrentPrice,
} from "./binance";

export {
  useTicker24hr,
  useTickers24hr,
  useKlines,
  useCurrentPrice,
} from "./hooks";

// Axios instance и типы
export { axiosInstance, customAxiosInstance } from "./axios-instance";
export type { ApiError } from "./axios-instance";

// Сгенерированные Orval хуки и типы
export * from "./generated/auth/auth";
export * from "./generated/users/users";
export * from "./generated/password-recovery/password-recovery";
export * from "./generated/app/app";
export * from "./generated/cryptoMonitorAPI.schemas";
