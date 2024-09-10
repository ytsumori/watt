"use client";

import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";

type Props = {
  title: string;
};

export function HeaderSection({ title }: Props) {
  const router = useRouter();
  return (
    <Flex as="header" w="full" p={4} alignItems="center" justifyContent="space-between">
      <IconButton
        icon={<ChevronLeftIcon />}
        fontSize="32px"
        aria-label="back"
        textColor="gray.800"
        variant="ghost"
        onClick={() => router.back()}
      />
      <Heading size="sm">{title}</Heading>
      <Box w="32px" />
    </Flex>
  );
}
