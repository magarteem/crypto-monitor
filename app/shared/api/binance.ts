import axios from "axios";
import type {
  BinanceTicker24hrResponse,
  BinanceKlineResponse,
  CryptoPriceData,
  Candle,
} from "@sharedTypes/api";

const BINANCE_API_BASE_URL = "https://api.binance.com/api/v3";

/**
 * Получает данные о тикере за 24 часа для одной монеты
 */
export async function fetchTicker24hr(
  symbol: string
): Promise<CryptoPriceData | null> {
  try {
    const { data } = await axios.get<BinanceTicker24hrResponse>(
      `${BINANCE_API_BASE_URL}/ticker/24hr`,
      {
        params: { symbol },
      }
    );

    return {
      currentPrice: parseFloat(data.lastPrice),
      change: parseFloat(data.priceChangePercent).toFixed(2),
    };
  } catch (error) {
    console.error(`Error fetching ticker for ${symbol}:`, error);
    return null;
  }
}

/**
 * Получает данные о тикерах за 24 часа для всех монет одним запросом
 * Возвращает Record с ключами-символами и значениями CryptoPriceData
 */
export async function fetchTickers24hr(
  symbols: readonly string[]
): Promise<Record<string, CryptoPriceData>> {
  try {
    // Формируем массив символов в формате JSON для параметра symbols
    const symbolsJson = JSON.stringify([...symbols]);
    const { data: allTickers } = await axios.get<BinanceTicker24hrResponse[]>(
      `${BINANCE_API_BASE_URL}/ticker/24hr`,
      {
        params: { symbols: symbolsJson },
      }
    );

    // Преобразуем массив тикеров в Record
    const result: Record<string, CryptoPriceData> = {};
    allTickers.forEach((ticker) => {
      result[ticker.symbol] = {
        currentPrice: parseFloat(ticker.lastPrice),
        change: parseFloat(ticker.priceChangePercent).toFixed(2),
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching tickers:", error);
    return {};
  }
}

/**
 * Получает свечи (klines) для символа
 */
export async function fetchKlines(
  symbol: string,
  interval: string = "1m",
  limit: number = 100
): Promise<Candle[]> {
  try {
    const { data: raw } = await axios.get<BinanceKlineResponse[]>(
      `${BINANCE_API_BASE_URL}/klines`,
      {
        params: { symbol, interval, limit },
      }
    );

    return raw.map((c) => ({
      x: new Date(c[0]),
      y: [
        parseFloat(c[1]), // open
        parseFloat(c[2]), // high
        parseFloat(c[3]), // low
        parseFloat(c[4]), // close
      ],
    }));
  } catch (error) {
    console.error(`Error fetching klines for ${symbol}:`, error);
    return [];
  }
}

/**
 * Получает текущую цену символа
 */
export async function fetchCurrentPrice(
  symbol: string
): Promise<number | null> {
  try {
    const { data } = await axios.get<{ symbol: string; price: string }>(
      `${BINANCE_API_BASE_URL}/ticker/price`,
      {
        params: { symbol },
      }
    );
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}
