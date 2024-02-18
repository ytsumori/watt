"use client";

import { Center, Heading, Text, VStack } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Center w="100vw" h="100vh">
      <VStack>
        <Heading size="sm">飲食店への登録が必要です</Heading>
        <Text>登録方法は運営会社にお問い合わせください。</Text>
      </VStack>
    </Center>
  );
}
