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
import { signIn, signOut } from "next-auth/react";
import { Payment } from "@prisma/client";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  preauthorizedPayment?: Payment;
  user?: Session["user"];
};

export default function BaseLayout({
  children,
  preauthorizedPayment,
  user,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOutClick = () => {
    if (confirm("ログアウトしますか？")) {
      signOut();
    }
  };
  return (
    <Box h="100vh" w="100vw">
      {preauthorizedPayment && !pathname.startsWith("/payments") && (
        <Box
          bg="red.400"
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          p={2}
          w="full"
          textAlign="center"
          zIndex={2}
          fontWeight={700}
          onClick={() => router.push(`/payments/${preauthorizedPayment.id}`)}
        >
          選択中の推しメシがあります
        </Box>
      )}
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
          {user ? (
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
