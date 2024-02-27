"use client";

import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaShop, FaMoneyCheck, FaChartLine } from "react-icons/fa6";

export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <MenuItem icon={<FaShop />} as={Link} href={"/admin/restaurants"}>
            レストラン一覧
          </MenuItem>
          <MenuItem icon={<FaMoneyCheck />} as={Link} href={"/admin/payments"}>
            決済一覧
          </MenuItem>
        </MenuList>
      </Menu>
      {children}
    </Box>
  );
}
