// Типы для ответов Binance API

export interface BinanceTicker24hrResponse {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  count: number;
}

export interface BinanceKlineResponse {
  0: number; // Open time
  1: string; // Open
  2: string; // High
  3: string; // Low
  4: string; // Close
  5: string; // Volume
  6: number; // Close time
  7: string; // Quote asset volume
  8: number; // Number of trades
  9: string; // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
}

export interface CryptoPriceData {
  currentPrice: number;
  change: string;
}

export interface Candle {
  x: Date;
  y: [number, number, number, number]; // [open, high, low, close]
}

