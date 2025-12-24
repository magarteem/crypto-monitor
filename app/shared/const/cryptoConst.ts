// Типы для криптовалютных монет
export interface CryptoCoin {
  symbol: string;
  name: string;
}

export type CryptoCoins = readonly CryptoCoin[];

// Список отслеживаемых монет
export const CRYPTO_COINS: CryptoCoins = [
  { symbol: "BTCUSDT", name: "BTC/USDT" },
  { symbol: "ETHUSDT", name: "ETH/USDT" },
  { symbol: "BNBUSDT", name: "BNB/USDT" },
  { symbol: "SOLUSDT", name: "SOL/USDT" },
  { symbol: "XRPUSDT", name: "XRP/USDT" },
  { symbol: "LINKUSDT", name: "LINK/USDT" },
  { symbol: "LTCUSDT", name: "LTC/USDT" },
  { symbol: "ATOMUSDT", name: "ATOM/USDT" },
  { symbol: "CHZUSDT", name: "CHZ/USDT" },
  { symbol: "AAVEUSDT", name: "AAVE/USDT" },
  { symbol: "INJUSDT", name: "INJ/USDT" },
  { symbol: "GNSUSDT", name: "GNS/USDT" },
];
