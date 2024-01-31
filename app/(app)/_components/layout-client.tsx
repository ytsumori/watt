"use client";

import React from "react";
import { Box, HStack, IconButton, VStack } from "@chakra-ui/react";
import { FaMap, FaQrcode, FaUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Box height="100vh" width="100vw">
      {children}
      <HStack
        backgroundColor="white"
        height="3.5rem"
        width="full"
        position="fixed"
        bottom={0}
        justifyContent="space-evenly"
      >
        <VStack spacing={0}>
          <IconButton
            aria-label="map"
            textColor="cyan.400"
            variant="ghost"
            icon={<FaMap />}
            onClick={() => router.push("/")}
          />
        </VStack>
        <IconButton
          aria-label="check-in"
          textColor="cyan.400"
          colorScheme="cyan"
          variant="ghost"
          icon={<FaQrcode />}
        />
        <IconButton
          aria-label="home"
          textColor="cyan.400"
          colorScheme="cyan"
          variant="ghost"
          icon={<FaUser />}
          onClick={() => router.push("/profile")}
        />
      </HStack>
    </Box>
  );
}
