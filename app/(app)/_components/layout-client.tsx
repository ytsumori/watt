"use client";

import React from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOutClick = () => {
    if (confirm("ログアウトしますか？")) {
      signOut();
    }
  };
  return (
    <Box h="100vh" w="100vw">
      <Menu>
        <MenuButton
          as={Avatar}
          name={user?.name ?? undefined}
          src={user?.image ?? undefined}
          boxShadow="0px 0px 2px black"
          position="fixed"
          margin={4}
          top={0}
          right={0}
          zIndex={1}
        />
        <MenuList>
          {session ? (
            <>
              <MenuItem onClick={() => console.error("TODO: Implement")}>
                決済一覧
              </MenuItem>
              <MenuItem onClick={handleSignOutClick}>ログアウト</MenuItem>
            </>
          ) : (
            <MenuItem onClick={() => signIn()}>ログイン</MenuItem>
          )}
        </MenuList>
      </Menu>
      {children}
    </Box>
  );
}
