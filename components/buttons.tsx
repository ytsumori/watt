"use client";

import { Button } from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";

// ログインボタン
export const LoginButton = () => {
  return (
    <Button textColor="white" onClick={() => signIn()}>
      ログイン
    </Button>
  );
};

// ログアウトボタン
export const LogoutButton = () => {
  return (
    <Button textColor="white" onClick={() => signOut()}>
      ログアウト
    </Button>
  );
};
