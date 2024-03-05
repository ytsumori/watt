"use client";

import { theme } from "@/lib/chakra-ui/theme";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
      <ProgressBar
        height="4px"
        color="#EFA039"
        shallowRouting
        options={{ showSpinner: false }}
      />
    </>
  );
}
