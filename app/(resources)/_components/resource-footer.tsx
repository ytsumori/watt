"use client";

import NextLink from "next/link";
import { Box, Grid, GridItem, Link, VStack } from "@chakra-ui/react";
import Image from "next/image";

export function ResourceFooter() {
  return (
    <Box p={4} color="brand.400">
      <NextLink href="/">
        <Image src="/watt-logo.png" alt="Watt" width={100} height={40} />
      </NextLink>
      <Grid templateColumns="repeat(2, 1fr)" gap={2} mt={4}>
        <GridItem>
          <VStack alignItems="start">
            <Link as={NextLink} href="https://kiizan-kiizan.co.jp/" isExternal>
              運営会社
            </Link>
            <Link as={NextLink} href="/terms">
              利用規約
            </Link>
          </VStack>
        </GridItem>
        <GridItem>
          <VStack alignItems="start">
            <Link as={NextLink} href="/transaction-law">
              特商法表記
            </Link>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
