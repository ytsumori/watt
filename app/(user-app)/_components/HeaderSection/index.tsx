"use client";

import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";

type Props = {
  title: string;
  backButtonPath: string;
};

export function HeaderSection({ title, backButtonPath }: Props) {
  return (
    <Flex as="header" w="full" p={4} alignItems="center" justifyContent="space-between">
      <IconButton
        icon={<ChevronLeftIcon />}
        fontSize="32px"
        aria-label="back"
        textColor="gray.800"
        variant="ghost"
        as={NextLink}
        href={backButtonPath}
        scroll={false}
      />
      <Heading size="sm">{title}</Heading>
      <Box w="32px" />
    </Flex>
  );
}
