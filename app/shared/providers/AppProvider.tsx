"use client";

import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ModalProvider } from "./ModalProvider";

interface AppProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10000,
    },
  },
});

export function AppProvider({ children }: AppProviderProps) {
  return (
    <SessionProvider>
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            {children}
          </ModalProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}
