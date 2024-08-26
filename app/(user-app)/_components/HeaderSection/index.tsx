"use client";

import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";
import NextLink from "next/link";

type Props = {
  title: string;
  backButtonPath?: string;
};

export function HeaderSection({ title, backButtonPath }: Props) {
  const router = useRouter();
  return (
    <Flex as="header" w="full" p={4} alignItems="center" justifyContent="space-between">
      <IconButton
        icon={<ChevronLeftIcon />}
        fontSize="32px"
        aria-label="back"
        onClick={() => {
          if (!backButtonPath) {
            router.back();
          }
        }}
        textColor="gray.800"
        variant="ghost"
        {...(backButtonPath ? { as: NextLink, href: backButtonPath } : {})}
      />
      <Heading size="sm">{title}</Heading>
      <Box w="32px" />
    </Flex>
  );
}
