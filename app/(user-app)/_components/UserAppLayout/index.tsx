"use client";

import React, { useEffect } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/confirm-modal";
import NextLink from "next/link";
import Image from "next/image";
import { findPreauthorizedOrder } from "@/actions/order";
import { User } from "@prisma/client";

type Props = {
  children: React.ReactNode;
  defaultPreauthorizedOrderId?: string;
  user?: User;
};

export default function UserAppLayout({ children, defaultPreauthorizedOrderId, user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isOpen: isOrderModalOpen,
    onOpen: onOrderModalOpen,
    onClose: onOrderModalClose
  } = useDisclosure({
    defaultIsOpen: !!defaultPreauthorizedOrderId && !pathname.startsWith("/orders")
  });
  const [preauthorizedOrderId, setPreauthorizedOrderId] = React.useState(defaultPreauthorizedOrderId);
  useEffect(() => {
    if (user) {
      if (!user.phoneNumber && pathname !== "/profile") {
        router.push(`/profile?redirectedFrom=${pathname}`);
      }
      if (!pathname.startsWith("/orders")) {
        findPreauthorizedOrder(user.id).then((preauthorizedOrder) => {
          if (!!preauthorizedOrder) {
            setPreauthorizedOrderId(preauthorizedOrder.id);
            onOrderModalOpen();
          }
        });
      }
    }
  }, [pathname, onOrderModalOpen, user, router]);

  const handleSignOutClick = () => {
    if (confirm("ログアウトしますか？")) {
      signOut();
    }
  };

  return (
    <>
      <Flex px={4} py={2} w="full" backgroundColor="white">
        <Box w="full">
          <HStack spacing={2} alignItems="end">
            <NextLink href="/">
              <Image src="/watt-logo.png" alt="Watt" width={80} height={31} />
            </NextLink>
            <Box backgroundColor="red.400" borderRadius={4}>
              <Text color="white" fontWeight="bold" fontSize="xs" px={2}>
                早期割引キャンペーン中!!
              </Text>
            </Box>
          </HStack>
          <Heading size="sm" color="orange" mt={1}>
            今入れるお店が見つかる！
          </Heading>
        </Box>
        <Spacer />
        <Menu>
          <MenuButton as={Avatar} name={user?.name ?? undefined} src={user?.image ?? undefined} my="auto" />
          <MenuList>
            <MenuItem as={NextLink} href="/">
              ホーム
            </MenuItem>
            {user ? (
              <>
                <MenuItem as={NextLink} href="/payment-methods">
                  支払い方法
                </MenuItem>
                <MenuItem as={NextLink} href="/orders">
                  注文履歴
                </MenuItem>
                <MenuItem as={NextLink} href="/profile">
                  プロフィール
                </MenuItem>
                <MenuItem onClick={handleSignOutClick}>ログアウト</MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => signIn()}>ログイン</MenuItem>
            )}
            <Accordion allowToggle>
              <AccordionItem border="none">
                <AccordionButton px={3} py="6px">
                  <Box as="span" flex="1" textAlign="left">
                    Wattについて
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel py={0} px={1}>
                  <MenuItem as="a" href="https://watt0313.studio.site/" target="_blank">
                    運営会社
                  </MenuItem>
                  <MenuItem as={NextLink} href="/terms">
                    利用規約
                  </MenuItem>
                  <MenuItem as={NextLink} href="/transaction-law">
                    特商法表記
                  </MenuItem>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </MenuList>
        </Menu>
      </Flex>
      {children}
      <ConfirmModal
        isOpen={isOrderModalOpen}
        onClose={onOrderModalClose}
        title="選択中の推しメシがあります"
        confirmButton={{
          label: "支払いページに移動する",
          onClick: () => {
            router.push(`/orders/${preauthorizedOrderId}`);
            onOrderModalClose();
          }
        }}
      >
        <Text>
          現在選択中の推しメシがあります。
          <br />
          お店に向かって支払いを完了してください。
        </Text>
      </ConfirmModal>
    </>
  );
}
