"use client";

import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { useRouter } from "next-nprogress-bar";
import NextLink from "next/link";
import { useEffect, useState } from "react";

type Props = {
  title: string;
  backButtonPath: string;
};

export function HeaderSection({ title, backButtonPath }: Props) {
  const router = useRouter();
  const [isHistoryBack, setIsHistoryBack] = useState(true);

  useEffect(() => {
    if (window.history.length > 1) {
      setIsHistoryBack(true);
    } else {
      setIsHistoryBack(false);
    }
  }, []);

  return (
    <Flex as="header" w="full" p={4} alignItems="center" justifyContent="space-between">
      <IconButton
        icon={<ChevronLeftIcon />}
        fontSize="32px"
        aria-label="back"
        textColor="gray.800"
        variant="ghost"
        {...(isHistoryBack ? { onClick: () => router.back() } : { as: NextLink, href: backButtonPath })}
      />
      <Heading size="sm">{title}</Heading>
      <Box w="32px" />
    </Flex>
  );
}
