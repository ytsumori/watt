"use client";

import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";
import { Payment } from "@prisma/client";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/confirm-modal";
import NextLink from "next/link";
import Image from "next/image";

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
  const {
    isOpen: isPaymentModalOpen,
    onOpen: onPaymentModalOpen,
    onClose: onPaymentModalClose,
  } = useDisclosure({
    defaultIsOpen: !!preauthorizedPayment && !pathname.startsWith("/payments"),
  });
  useEffect(() => {
    if (!!preauthorizedPayment && !pathname.startsWith("/payments")) {
      onPaymentModalOpen();
    }
  }, [pathname, preauthorizedPayment, onPaymentModalOpen]);

  const handleSignOutClick = () => {
    if (confirm("ログアウトしますか？")) {
      signOut();
    }
  };

  return (
    <Box h="100vh" w="100vw">
      <ConfirmModal
        isOpen={isPaymentModalOpen}
        onClose={onPaymentModalClose}
        title="選択中の推しメシがあります"
        confirmButton={{
          label: "支払いページに移動する",
          onClick: () => {
            router.push(`/payments/${preauthorizedPayment?.id}`);
            onPaymentModalClose();
          },
        }}
      >
        <Text>
          現在選択中の推しメシがあります。
          <br />
          お店に向かって支払いを完了してください。
        </Text>
      </ConfirmModal>
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
          <Box mx={3} mb={4} mt={2}>
            <Image src="/watt-logo.png" alt="Watt" width="50" height="50" />
          </Box>
          <MenuDivider />
          <MenuGroup title="メニュー">
            <MenuItem as={NextLink} href="/">
              ホーム
            </MenuItem>
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
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Wattについて">
            <MenuItem
              as="a"
              href="https://kiizan-kiizan.co.jp/"
              target="_blank"
            >
              運営会社
            </MenuItem>
            <MenuItem as={NextLink} href="/terms">
              利用規約
            </MenuItem>
            <MenuItem as={NextLink} href="/transaction-law">
              特商法表記
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
      {children}
    </Box>
  );
}
