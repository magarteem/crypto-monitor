import { useQuery } from "@tanstack/react-query";
import { customAxiosInstance } from "@/app/shared/api";

interface OAuthLoginResponse {
  id: number;
  name: string;
}

/**
 * Контроллер для получения данных OAuth логина (в стиле Orval)
 */
const oauthControllerGetLogin = (signal?: AbortSignal) => {
  return customAxiosInstance<OAuthLoginResponse[]>({
    url: `/auth/oauth/login`,
    method: "GET",
    signal,
  });
};

/**
 * Ключ для кэша запроса (в стиле Orval)
 */
export const getOauthControllerGetLoginQueryKey = () => {
  return [`/auth/oauth/login`] as const;
};

/**
 * Опции для useQuery (в стиле Orval)
 */
export const getOauthControllerGetLoginQueryOptions = <
  TData = Awaited<ReturnType<typeof oauthControllerGetLogin>>,
  TError = void
>(options?: {
  query?: Partial<
    import("@tanstack/react-query").UseQueryOptions<
      Awaited<ReturnType<typeof oauthControllerGetLogin>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getOauthControllerGetLoginQueryKey();

  const queryFn: import("@tanstack/react-query").QueryFunction<
    Awaited<ReturnType<typeof oauthControllerGetLogin>>
  > = ({ signal }) => oauthControllerGetLogin(signal);

  return {
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут
    refetchOnWindowFocus: false,
    retry: 1,
    ...queryOptions,
  } as import("@tanstack/react-query").UseQueryOptions<
    Awaited<ReturnType<typeof oauthControllerGetLogin>>,
    TError,
    TData
  > & { queryKey: typeof queryKey };
};

/**
 * Хук для получения данных OAuth логина (в стиле Orval)
 */
export function useQueryOauthLogin<
  TData = Awaited<ReturnType<typeof oauthControllerGetLogin>>,
  TError = void
>(options?: {
  query?: Partial<
    import("@tanstack/react-query").UseQueryOptions<
      Awaited<ReturnType<typeof oauthControllerGetLogin>>,
      TError,
      TData
    >
  >;
}) {
  const queryOptions = getOauthControllerGetLoginQueryOptions(options);

  return useQuery(queryOptions);
}
