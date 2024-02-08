"use client";

import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CiShop, CiMoneyCheck1 } from "react-icons/ci";

export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
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
          <MenuItem
            icon={<CiShop />}
            onClick={() => router.push("/admin/restaurants")}
          >
            レストラン一覧
          </MenuItem>
          <MenuItem
            icon={<CiMoneyCheck1 />}
            onClick={() => router.push("/admin/payments")}
          >
            決済一覧
          </MenuItem>
        </MenuList>
      </Menu>
      {children}
    </Box>
  );
}
