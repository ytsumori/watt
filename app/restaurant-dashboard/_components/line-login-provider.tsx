"use client";

import { Progress } from "@chakra-ui/react";
import liff from "@line/liff";
import { createContext, useEffect, useState } from "react";

export const LineIdTokenContext = createContext("");

export function LineLoginProvider({ children }: { children: React.ReactNode }) {
  const [idToken, setIdToken] = useState<string>();
  useEffect(() => {
    liff
      .init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        const idToken = liff.getIDToken();
        if (!idToken) throw new Error("No id token");
        setIdToken(idToken);
      });
  }, []);

  if (!idToken) return <Progress isIndeterminate />;

  return (
    <LineIdTokenContext.Provider value={idToken}>
      {children}
    </LineIdTokenContext.Provider>
  );
}
