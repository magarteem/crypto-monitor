"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const ClientSocketConnection = () => {
  const socketRef = useRef<Socket | null>(null);

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

    // Получаем сообщения от сервера
    socket.on("message", (data: string) => {
      console.log("[ClientSocketConnection] 📨 Получено сообщение:", data);
    });

    // Очистка при размонтировании
    return () => {
      console.log("[ClientSocketConnection] 🧹 Закрытие соединения...");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Компонент не рендерит ничего визуального
  return null;
};
