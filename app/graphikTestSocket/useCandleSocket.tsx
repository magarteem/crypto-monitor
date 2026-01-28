"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type SubscribePayload = { symbol: string; timeframe: string };

export type CandleUpdate = {
  symbol: string;
  timeframe: string;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  isFinal: boolean;
};

export type PoolStats = {
  totalSubscriptions: number;
  subscriptions: Array<{
    key: string;
    symbol: string;
    timeframe: string;
    clients: number;
    wsReadyState: number;
  }>;
};

type UseCandleSocketOptions = {
  url?: string; // например "http://localhost:4000"
  autoConnect?: boolean;
};

export function useCandleSocket(options: UseCandleSocketOptions = {}) {
  const { url = "http://localhost:4000", autoConnect = true } = options;

  const socketRef = useRef<Socket | null>(null);
  const subsRef = useRef<Set<string>>(new Set());

  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [lastCandle, setLastCandle] = useState<CandleUpdate | null>(null);
  const [poolStats, setPoolStats] = useState<PoolStats | null>(null);

  const makeKey = useCallback((s: SubscribePayload) => {
    return `${s.symbol.trim().toLowerCase()}_${s.timeframe.trim().toLowerCase()}`;
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current) return socketRef.current;

    const socket = io(url, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: true,
    });

    socket.on("connect", () => {
      setConnected(true);
      setSocketId(socket.id ?? null);

      // восстановление подписок после перезагрузки/переподключения
      subsRef.current.forEach((key) => {
        const [symbol, timeframe] = key.split("_");
        socket.emit("subscribe-candle", { symbol, timeframe });
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setSocketId(null);
    });

    socket.on("candle-update", (data: CandleUpdate) => {
      setLastCandle(data);
    });

    socket.on("binance-pool-stats", (stats: PoolStats) => {
      setPoolStats(stats);
    });

    socketRef.current = socket;
    return socket;
  }, [url]);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // отписаться от всего перед disconnect (опционально, но полезно)
    subsRef.current.forEach((key) => {
      const [symbol, timeframe] = key.split("_");
      socket.emit("unsubscribe-candle", { symbol, timeframe });
    });
    subsRef.current.clear();

    socket.removeAllListeners();
    socket.disconnect();
    socketRef.current = null;
    setConnected(false);
    setSocketId(null);
  }, []);

  const subscribe = useCallback(
    (payload: SubscribePayload) => {
      const socket = socketRef.current ?? connect();
      const key = makeKey(payload);
      subsRef.current.add(key);
      socket.emit("subscribe-candle", payload);
    },
    [connect, makeKey],
  );

  const unsubscribe = useCallback(
    (payload: SubscribePayload) => {
      const socket = socketRef.current;
      const key = makeKey(payload);
      subsRef.current.delete(key);
      socket?.emit("unsubscribe-candle", payload);
    },
    [makeKey],
  );

  const requestPoolStats = useCallback(() => {
    const socket = socketRef.current ?? connect();
    socket.emit("binance-pool-stats");
  }, [connect]);

  useEffect(() => {
    if (!autoConnect) return;
    connect();
    return () => disconnect();
  }, [autoConnect, connect, disconnect]);

  return useMemo(
    () => ({
      connected,
      socketId,
      lastCandle,
      poolStats,
      connect,
      disconnect,
      subscribe,
      unsubscribe,
      requestPoolStats,
    }),
    [
      connected,
      socketId,
      lastCandle,
      poolStats,
      connect,
      disconnect,
      subscribe,
      unsubscribe,
      requestPoolStats,
    ],
  );
}