"use client";

import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";
import Link from "next/link";
import { ADMIN_PAGE_MENU } from "../../_constants/admin-page-menu";

export function AdminHomePage() {
  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        管理画面
      </Heading>
      <UnorderedList>
        {ADMIN_PAGE_MENU.map((page) => (
          <ListItem key={page.pathname}>
            <Link href={page.pathname}>{page.title}</Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}
