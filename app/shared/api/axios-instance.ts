import axios, { AxiosRequestConfig, AxiosError } from "axios";

// Создаём кастомный axios instance
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 секунд
});

// Request interceptor - добавляем токен авторизации
axiosInstance.interceptors.request.use(
  (config) => {
    // Получаем токен из localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
  (error: AxiosError) => {
    // Обработка ошибки 401 (Unauthorized)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Удаляем токен
        localStorage.removeItem("auth_token");
        // Редирект на страницу логина
        window.location.href = "/auth";
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
