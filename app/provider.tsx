"use client";

import { theme } from "@/lib/chakra-ui/theme";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <SessionProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </SessionProvider>
    </CacheProvider>
  );
}
