"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";

interface CandleUpdate {
  symbol: string;
  timeframe: string;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  isFinal: boolean;
}

interface HistoricalKlinesData {
  symbol: string;
  interval: string;
  data: Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
}

type CandleUpdateCallback = (data: CandleUpdate) => void;
type HistoricalKlinesCallback = (data: HistoricalKlinesData) => void;
type ErrorCallback = (error: any) => void;

interface SocketContextValue {
  socket: Socket | null;
  subscribeToCandle: (
    symbol: string,
    timeframe: string,
    onUpdate: CandleUpdateCallback,
  ) => () => void;
  unsubscribeFromCandle: (symbol: string, timeframe: string) => void;
  getHistoricalKlines: (
    symbol: string,
    interval: string,
    limit?: number,
    endTime?: number,
  ) => Promise<HistoricalKlinesData>;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within ClientSocketConnection");
  }
  return context;
};

export const ClientSocketConnection = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socketRef = useRef<Socket | null>(null);
  const callbacksRef = useRef<
    Map<string, Set<CandleUpdateCallback>>
  >(new Map());
  const pendingRequestsRef = useRef<
    Map<
      string,
      {
        resolve: (data: HistoricalKlinesData) => void;
        reject: (error: Error) => void;
        timeout: NodeJS.Timeout;
      }
    >
  >(new Map());

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    console.log(
      "[ClientSocketConnection] 🔌 Подключение к серверу:",
      apiUrl,
    );

    // Создаем подключение к серверу через socket.io
    const socket = io(apiUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "[ClientSocketConnection] ✅ Подключен к серверу. ID:",
        socket.id,
      );
      // При переподключении восстанавливаем все активные подписки
      callbacksRef.current.forEach((_, key) => {
        const [symbol, timeframe] = key.split("_");
        socket.emit("subscribe-candle", { symbol, timeframe });
      });
    });

    socket.on("disconnect", (reason) => {
      console.log(
        "[ClientSocketConnection] 🔌 Отключен от сервера. Причина:",
        reason,
      );
    });

    socket.on("connect_error", (error) => {
      console.error(
        "[ClientSocketConnection] ❌ Ошибка подключения:",
        error.message,
      );
    });

    // Обработка обновлений свечей
    socket.on("candle-update", (data: CandleUpdate) => {
      const key = `${data.symbol}_${data.timeframe}`;
      const callbacks = callbacksRef.current.get(key);
      if (callbacks) {
        callbacks.forEach((callback) => callback(data));
      }
    });

    // Обработка исторических данных
    socket.on("historical-klines", (data: HistoricalKlinesData) => {
      const key = `${data.symbol}_${data.interval}`;
      const request = pendingRequestsRef.current.get(key);
      if (request) {
        clearTimeout(request.timeout);
        request.resolve(data);
        pendingRequestsRef.current.delete(key);
      }
    });

    socket.on("historical-klines-error", (error: any) => {
      const key = `${error.symbol}_${error.interval}`;
      const request = pendingRequestsRef.current.get(key);
      if (request) {
        clearTimeout(request.timeout);
        request.reject(
          new Error(error.error || "Ошибка получения данных")
        );
        pendingRequestsRef.current.delete(key);
      }
    });

    // Очистка при размонтировании
    return () => {
      console.log("[ClientSocketConnection] 🧹 Закрытие соединения...");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      callbacksRef.current.clear();
      // Очищаем все pending запросы
      pendingRequestsRef.current.forEach((request) => {
        clearTimeout(request.timeout);
        request.reject(new Error("Соединение закрыто"));
      });
      pendingRequestsRef.current.clear();
    };
  }, []);

  const subscribeToCandle = (
    symbol: string,
    timeframe: string,
    onUpdate: CandleUpdateCallback,
  ) => {
    const key = `${symbol}_${timeframe}`;
    
    // Добавляем callback в любом случае
    if (!callbacksRef.current.has(key)) {
      callbacksRef.current.set(key, new Set());
    }
    const callbacks = callbacksRef.current.get(key)!;
    callbacks.add(onUpdate);

    // Подписываемся на сервере, если socket подключен
    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit("subscribe-candle", { symbol, timeframe });
    } else {
      // Если socket еще не подключен, подпишемся при подключении
      const onConnect = () => {
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit("subscribe-candle", { symbol, timeframe });
        }
        socketRef.current?.off("connect", onConnect);
      };
      socketRef.current?.on("connect", onConnect);
    }

    return () => {
      callbacks.delete(onUpdate);
      if (callbacks.size === 0) {
        callbacksRef.current.delete(key);
        if (socket && socket.connected) {
          socket.emit("unsubscribe-candle", { symbol, timeframe });
        }
      }
    };
  };

  const unsubscribeFromCandle = (symbol: string, timeframe: string) => {
    const socket = socketRef.current;
    const key = `${symbol}_${timeframe}`;
    callbacksRef.current.delete(key);

    if (socket && socket.connected) {
      socket.emit("unsubscribe-candle", { symbol, timeframe });
    }
  };

  const getHistoricalKlines = async (
    symbol: string,
    interval: string,
    limit: number = 200,
    endTime?: number,
  ): Promise<HistoricalKlinesData> => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) {
      throw new Error("Socket не подключен");
    }

    // Используем ключ для идентификации запроса
    const key = `${symbol}_${interval}`;
    
    // Если уже есть pending запрос для этого символа/интервала, ждем его завершения
    const existingRequest = pendingRequestsRef.current.get(key);
    if (existingRequest) {
      // Ждем завершения существующего запроса и возвращаем тот же результат
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (!pendingRequestsRef.current.has(key)) {
            clearInterval(checkInterval);
            // Повторяем запрос после завершения предыдущего
            setTimeout(() => {
              getHistoricalKlines(symbol, interval, limit, endTime)
                .then(resolve)
                .catch(reject);
            }, 200);
          }
        }, 100);
        
        // Таймаут для ожидания
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Timeout ожидания предыдущего запроса"));
        }, 35000);
      });
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const request = pendingRequestsRef.current.get(key);
        if (request === pendingRequest) {
          pendingRequestsRef.current.delete(key);
        }
        reject(new Error("Timeout получения исторических данных"));
      }, 30000); // Увеличиваем таймаут до 30 секунд

      const pendingRequest = { resolve, reject, timeout };
      pendingRequestsRef.current.set(key, pendingRequest);

      // Небольшая задержка перед отправкой, чтобы не перегружать сервер
      setTimeout(() => {
        if (socket.connected && pendingRequestsRef.current.has(key)) {
          socket.emit("get-historical-klines", { 
            symbol, 
            interval, 
            limit, 
            endTime
          });
        } else {
          clearTimeout(timeout);
          pendingRequestsRef.current.delete(key);
          reject(new Error("Socket отключен"));
        }
      }, 50);
    });
  };

  const contextValue: SocketContextValue = {
    socket: socketRef.current,
    subscribeToCandle,
    unsubscribeFromCandle,
    getHistoricalKlines,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
