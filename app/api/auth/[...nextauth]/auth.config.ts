import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { axiosInstance } from "@/app/shared/api/axios-instance";

interface AuthResponse {
  user: {
    id: string;
    email: string | null;
    displayName: string | null;
    picture: string | null;
    role: string;
    method: string;
  };
  token: string;
}

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
          const response = await axiosInstance.post<AuthResponse>(
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
            accessToken: token, // Сохраняем токен в объекте пользователя
          };
        } catch (error: any) {
          console.error("Login error:", error);
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
        // Сохраняем токен API, если он есть (для credentials провайдера)
        if ("accessToken" in user && user.accessToken) {
          token.accessToken = user.accessToken as string;
        }
      }

      // Для Google OAuth отправляем данные на бэкенд для создания/регистрации пользователя
      if (account?.provider === "google" && user) {
        // Отправляем данные на бэкенд только при первой авторизации
        if (!token.googleOAuthSent) {
          try {
            const apiUrl =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const response = await axios.post<AuthResponse>(
              `${apiUrl}/api/auth/oauth/google`,
              {
                email: user.email ?? "",
                name: user.name ?? "",
                picture: user.image ?? undefined,
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

            // Сохраняем данные пользователя и токен от бэкенда
            const { user: apiUser, token: apiToken } = response.data;
            token.id = apiUser.id;
            token.email = apiUser.email || user.email || token.email;
            token.name = apiUser.displayName || user.name || token.name;
            token.picture = apiUser.picture || user.image || token.picture;
            token.accessToken = apiToken;

            // Помечаем, что запрос уже был отправлен
            token.googleOAuthSent = true;
          } catch (error: any) {
            console.error("Google OAuth error:", error);
            // Используем данные от next-auth, если запрос не удался
            token.id = user.id;
            token.email = user.email || token.email;
            token.name = user.name || token.name;
            token.picture = user.image || token.picture;
          }
        } else {
          // Если уже был отправлен, используем сохраненные данные
          token.id = token.id || user.id;
          token.email = token.email || user.email || undefined;
          token.name = token.name || user.name || undefined;
          token.picture = token.picture || user.image || undefined;
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
        // Добавляем токен API в session для доступа на клиенте
        if (token.accessToken) {
          (session as any).accessToken = token.accessToken;
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
