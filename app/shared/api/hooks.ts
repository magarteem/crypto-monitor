import { useQuery } from "@tanstack/react-query";
import {
  fetchTicker24hr,
  fetchTickers24hr,
  fetchKlines,
  fetchCurrentPrice,
  fetchAllUSDTSymbols,
  type BinanceSymbolInfo,
} from "./binance";
import type { CryptoPriceData, Candle } from "@sharedTypes/api";

/**
 * Хук для получения данных тикера за 24 часа для одной монеты
 */
export function useTicker24hr(symbol: string) {
  return useQuery<CryptoPriceData | null>({
    queryKey: ["ticker24hr", symbol],
    queryFn: () => fetchTicker24hr(symbol),
    //refetchInterval: 30000, // Обновление каждые 30 секунд
    //staleTime: 25000, // Данные считаются свежими 25 секунд
  });
}

/**
 * Хук для получения данных тикеров за 24 часа для массива монет одним запросом
 */
export function useTickers24hr(symbols: readonly string[]) {
  return useQuery<Record<string, CryptoPriceData>>({
    queryKey: ["tickers24hr", symbols.join(",")],
    queryFn: () => fetchTickers24hr(symbols),
    refetchInterval: 30000, // Обновление каждые 30 секунд
    staleTime: 25000, // Данные считаются свежими 25 секунд
    enabled: symbols.length > 0,
  });
}

/**
 * Хук для получения свечей (klines)
 */
export function useKlines(
  symbol: string,
  interval: string = "1m",
  limit: number = 100
) {
  return useQuery<Candle[]>({
    queryKey: ["klines", symbol, interval, limit],
    queryFn: () => fetchKlines(symbol, interval, limit),
    //refetchInterval: 10000, // Обновление каждые 10 секунд
    //staleTime: 8000, // Данные считаются свежими 8 секунд
  });
}

/**
 * Хук для получения текущей цены
 */
export function useCurrentPrice(symbol: string) {
  return useQuery<number | null>({
    queryKey: ["currentPrice", symbol],
    queryFn: () => fetchCurrentPrice(symbol),
    //refetchInterval: 5000, // Обновление каждые 5 секунд
    //staleTime: 4000, // Данные считаются свежими 4 секунды
  });
}

/**
 * Хук для получения всех доступных USDT торговых пар
 */
export function useAllUSDTSymbols() {
  return useQuery<BinanceSymbolInfo[]>({
    queryKey: ["allUSDTSymbols"],
    queryFn: fetchAllUSDTSymbols,
    staleTime: 3600000, // Данные считаются свежими 1 час
    gcTime: 7200000, // Кэш хранится 2 часа
  });
}
