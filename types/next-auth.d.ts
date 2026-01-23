import NextAuth from "next-auth";
import type { 
  AuthUserResponseDtoRole, 
  AuthUserResponseDtoMethod 
} from "@/app/shared/api/generated/cryptoMonitorAPI.schemas";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      method?: AuthUserResponseDtoMethod;
      role?: AuthUserResponseDtoRole;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    method?: AuthUserResponseDtoMethod;
    role?: AuthUserResponseDtoRole;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
    googleOAuthSent?: boolean;
    email?: string;
    name?: string;
    picture?: string;
    method?: AuthUserResponseDtoMethod;
    role?: AuthUserResponseDtoRole;
  }
}
