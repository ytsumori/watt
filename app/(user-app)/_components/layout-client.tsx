"use client";

import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";
import { Payment } from "@prisma/client";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/confirm-modal";

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
