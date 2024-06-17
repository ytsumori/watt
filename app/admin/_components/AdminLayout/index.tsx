"use client";

import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import Link from "next/link";
import { ADMIN_PAGE_MENU } from "../../_constants/admin-page-menu";

export function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box position="relative">
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Menu"
          icon={<HamburgerIcon />}
          variant="outline"
          position="absolute"
          right={4}
          top={4}
        />
        <MenuList>
          {ADMIN_PAGE_MENU.map((page) => (
            <MenuItem key={page.pathname} icon={page.icon} as={Link} href={page.pathname}>
              {page.title}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {children}
    </Box>
  );
}
