"use client";

import { CopyIcon, ExternalLinkIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
  useToast,
  Tooltip
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { copySignUpURL } from "../../_util/clipboard-text";
import NextLink from "next/link";

type Props = {
  restaurants: Prisma.RestaurantGetPayload<{ include: { googleMapPlaceInfo: { select: { url: true } } } }>[];
};

export function RestaurantsPage({ restaurants }: Props) {
  const toast = useToast();
  return (
    <Box p={6}>
      <Link href="/admin/restaurants/new">
        <Button size="md">新規登録</Button>
      </Link>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>レストラン名</Th>
              <Th textAlign="center">
                登録用URL
                <Tooltip label="飲食店が管理画面にログインするためのURLをコピーします">
                  <InfoOutlineIcon mx="2px" />
                </Tooltip>
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {restaurants.map((restaurant) => {
              const handleCopy = () => {
                copySignUpURL({
                  id: restaurant.id,
                  password: restaurant.password
                });
                toast({
                  title: "コピーしました",
                  status: "success",
                  duration: 2000
                });
              };
              return (
                <Tr key={restaurant.id}>
                  <Td>{restaurant.id}</Td>
                  <Td>
                    <Link href={"restaurants/" + restaurant.id}>{restaurant.name}</Link>
                  </Td>
                  <Td textAlign="center">
                    <IconButton aria-label="登録用URLコピー" icon={<CopyIcon />} onClick={handleCopy} />
                  </Td>
                  <Td>
                    {restaurant.googleMapPlaceInfo && (
                      <Link as={NextLink} href={restaurant.googleMapPlaceInfo.url} isExternal>
                        Googleマップ
                        <ExternalLinkIcon mx="2px" />
                      </Link>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
