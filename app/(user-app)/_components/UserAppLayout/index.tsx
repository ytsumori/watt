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
import { findPreorder } from "@/actions/order";
import { User } from "@prisma/client";
import { OnboardingModal } from "../OnboardingModal";

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
      if (!user.phoneNumber && pathname !== "/profile") router.push(`/profile?redirectedFrom=${pathname}`);
      if (!pathname.startsWith("/orders")) {
        findPreorder(user.id).then((preauthorizedOrder) => {
          if (!!preauthorizedOrder) {
            setPreauthorizedOrderId(preauthorizedOrder.id);
            onOrderModalOpen();
          }
        });
      }
    }
  }, [pathname, onOrderModalOpen, user, router]);

  if (pathname === "/signin") return <>{children}</>;

  const handleSignOutClick = () => {
    if (confirm("ログアウトしますか？")) signOut();
  };

  return (
    <>
      <Flex h="100svh" w="100vw" direction="column">
        <Flex px={4} py={2} w="full" backgroundColor="white">
          <Box w="full">
            <HStack spacing={4} alignItems="center">
              <NextLink href="/">
                <Image src="/watt-logo.png" alt="Watt" width={80} height={31} />
              </NextLink>
              <Text fontSize="sm" color="brand.400" fontWeight="bold">
                今すぐ入れるお店が見つかる！
              </Text>
            </HStack>
          </Box>
          <Spacer />
          <Menu>
            <MenuButton
              as={Avatar}
              name={user?.name ?? undefined}
              src={user?.image ?? undefined}
              my="auto"
              width="32px"
              height="32px"
            />
            <MenuList>
              <MenuItem as={NextLink} href="/">
                ホーム
              </MenuItem>
              {user ? (
                <>
                  <MenuItem as={NextLink} href="/orders">
                    注文履歴
                  </MenuItem>
                  <MenuItem as={NextLink} href="/payment-methods">
                    支払い方法
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
                    <MenuItem as="a" href="https://corp.watt.jp.net/" target="_blank">
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
      </Flex>
      <ConfirmModal
        isOpen={isOrderModalOpen}
        onClose={onOrderModalClose}
        title="すでに注文した推しメシがあります"
        confirmButton={{
          label: "注文ページに移動する",
          onClick: () => {
            router.push(`/orders/${preauthorizedOrderId}`);
            onOrderModalClose();
          }
        }}
      >
        <Text>
          注文した推しメシがあります。
          <br />
          お店に向かってください。
        </Text>
      </ConfirmModal>
      <OnboardingModal />
    </>
  );
}
