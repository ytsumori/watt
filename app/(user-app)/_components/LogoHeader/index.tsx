"use client";

import React, { useEffect, useState } from "react";
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
import NextLink from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
import { OnboardingModal } from "../OnboardingModal";
import { getUser } from "./actions/getUser";

export function LogoHeader() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    getUser().then(setUser);
  }, [setUser]);
  const {
    isOpen: isOnboardingModalOpen,
    onOpen: onOpenOnboardingModal,
    onClose: onCloseOnboardingModal
  } = useDisclosure();

  const handleSignOutClick = () => {
    if (confirm("ログアウトしますか？")) signOut();
  };

  return (
    <>
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
            <MenuItem onClick={onOpenOnboardingModal}>使い方</MenuItem>
            {user ? (
              <>
                <MenuItem as={NextLink} href="/orders">
                  注文履歴
                </MenuItem>
                <MenuItem as={NextLink} href="/profile">
                  プロフィール
                </MenuItem>
                <MenuItem onClick={handleSignOutClick}>ログアウト</MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => signIn("line", { callbackUrl: "/" })}>ログイン</MenuItem>
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
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </MenuList>
        </Menu>
      </Flex>
      <OnboardingModal isOpen={isOnboardingModalOpen} onClose={onCloseOnboardingModal} />
    </>
  );
}
