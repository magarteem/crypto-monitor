import { defineConfig } from "orval";

export default defineConfig({
  "crypto-api": {
    input: {
      // URL к вашему Swagger документу (JSON спецификация, не HTML UI)
      target: "http://localhost:4000/api/docs-json",
    },
    output: {
      // Куда генерировать код
      target: "./app/shared/api/generated",

      // Настройки клиента
      client: "react-query",
      mode: "tags-split", // Разделение по тегам из Swagger

      // Дополнительные опции
      override: {
        // Использовать кастомный axios instance
        mutator: {
          path: "./app/shared/api/axios-instance.ts",
          name: "customAxiosInstance",
        },

        // Настройки React Query
        query: {
          useQuery: true,
          useMutation: true,
          useInfinite: false,
          options: {
            staleTime: 10000, // Данные актуальны 10 секунд
            refetchOnWindowFocus: false,
          },
        },
      },
    },
  },
});
