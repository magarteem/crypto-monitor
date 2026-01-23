import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

// Создаём кастомный axios instance
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 секунд
});

// Request interceptor - добавляем токен авторизации из next-auth session
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Получаем токен из next-auth session
    if (typeof window !== "undefined") {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch (error) {
        // Игнорируем ошибки получения session
        console.warn("Failed to get session for axios request:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обработка ошибок
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Обработка ошибки 401 (Unauthorized)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Редирект на страницу логина можно добавить при необходимости
        // window.location.href = "/auth";
      }
    }

    // Обработка ошибки 403 (Forbidden)
    if (error.response?.status === 403) {
      console.error("Access denied");
    }

    // Обработка ошибки 500 (Server Error)
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// Функция-обёртка для Orval mutator
export const customAxiosInstance = <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();

  const promise = axiosInstance({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

// Типы для использования в компонентах
export type ApiError = AxiosError;
