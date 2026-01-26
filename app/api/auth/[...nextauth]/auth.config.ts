import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { axiosInstance } from "@/app/shared/api/axios-instance";
import { AuthResponseDto } from "@/app/shared/api/generated/cryptoMonitorAPI.schemas";

export const authOptions: AuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // Email/Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await axiosInstance.post<AuthResponseDto>(
            "/api/auth/login",
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const { user, token } = response.data;

          return {
            id: user.id,
            email: user.email || credentials.email,
            name: user.displayName || user.email?.split("@")[0] || "User",
            image: user.picture || undefined,
            method: user.method,
            role: user.role,
            accessToken: token, // Сохраняем токен в объекте пользователя
          };
        } catch (error: any) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),

    // Telegram OAuth Provider
    CredentialsProvider({
      id: "telegram",
      name: "Telegram",
      credentials: {
        telegramData: { label: "Telegram Data", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.telegramData) {
          return null;
        }

        try {
          // Парсим данные от Telegram
          const telegramUser = JSON.parse(credentials.telegramData);

          console.log("telegramUser === ", telegramUser);

          // Отправляем данные на бэкенд для валидации и создания пользователя
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
          const response = await axios.post<AuthResponseDto>(
            `${apiUrl}/api/auth/oauth/telegram`,
            {
              id: telegramUser.id,
              firstName: telegramUser.first_name,
              lastName: telegramUser.last_name,
              username: telegramUser.username,
              photoUrl: telegramUser.photo_url,
              authDate: telegramUser.auth_date,
              hash: telegramUser.hash,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const { user: apiUser, token: apiToken } = response.data;

          return {
            id: apiUser.id,
            email: apiUser.email || `tg_${apiUser.id}@telegram.local`,
            name: apiUser.displayName || telegramUser.first_name || "Telegram User",
            image: apiUser.picture || telegramUser.photo_url || undefined,
            method: apiUser.method,
            role: apiUser.role,
            accessToken: apiToken,
            telegramId: telegramUser.id.toString(),
          };
        } catch (error: any) {
          console.error("Telegram OAuth error:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // При первой авторизации сохраняем данные пользователя
      if (user) {
        token.id = user.id;
        token.email = user.email || undefined;
        token.name = user.name || undefined;
        token.picture = user.image || undefined;
        token.method = user.method;
        token.role = user.role;
        // Сохраняем токен API, если он есть (для credentials провайдера)
        if ("accessToken" in user && user.accessToken) {
          token.accessToken = user.accessToken as string;
        }
      }

      // Для Google OAuth отправляем данные на бэкенд для создания/регистрации пользователя
      if (account?.provider === "google" && user) {
        // Отправляем данные на бэкенд только при первой авторизации
        if (!token.googleOAuthSent) {
          console.log("user === ", user);
          console.log("account === ", account);
          try {
            const apiUrl =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const response = await axios.post<AuthResponseDto>(
              `${apiUrl}/api/auth/oauth/google`,
              {
                email: user.email ?? "",
                name: user.name ?? "",
                googleId: account.providerAccountId,
                accessToken: account.access_token ?? "",
                refreshToken: account.refresh_token ?? undefined,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("response === ", response.data);
            // Сохраняем данные пользователя и токен от бэкенда
            const { user: apiUser, token: apiToken } = response.data;
            token.id = apiUser.id;
            token.email = apiUser.email || user.email || token.email;
            token.name = apiUser.displayName || user.name || token.name;
            token.picture = apiUser.picture || user.image || token.picture;
            token.method = apiUser.method;
            token.role = apiUser.role;
            token.accessToken = apiToken;

            // Помечаем, что запрос уже был отправлен
            token.googleOAuthSent = true;
          } catch (error: any) {
            console.error("Google OAuth error:", error);
            // Используем данные от next-auth, если запрос не удался
            token.id = user.id;
            token.email = user.email || token.email;

          }
        } else {
          // Если уже был отправлен, используем сохраненные данные
          token.id = token.id || user.id;
          token.email = token.email || user.email || undefined;
        }
      }

      // Для Telegram OAuth данные уже обработаны в authorize, просто сохраняем их
      if (account?.provider === "telegram" && user) {
        // Данные уже получены от бэкенда в authorize, просто сохраняем
        token.id = user.id;
        token.email = user.email || undefined;
        token.name = user.name || undefined;
        token.picture = user.image || undefined;
        token.method = user.method;
        token.role = user.role;
        if ("accessToken" in user && user.accessToken) {
          token.accessToken = user.accessToken as string;
        }
        if ("telegramId" in user && user.telegramId) {
          token.telegramId = user.telegramId as string;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.method = token.method;
        session.user.role = token.role;
        // Добавляем токен API в session для доступа на клиенте
        if (token.accessToken) {
          session.accessToken = token.accessToken;
        }
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
