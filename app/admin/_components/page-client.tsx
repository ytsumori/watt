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
  Link as ChakraLink,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { copyCredentialToClipboard } from "../_util/clipboard-text";

type Props = {
  restaurants: Prisma.RestaurantGetPayload<{ include: { tokens: true } }>[];
};

export function RestaurantsPage({ restaurants }: Props) {
  const toast = useToast();
  return (
    <Box p={6}>
      <Link href="/admin/new">
        <Button size="md" color="white">
          新規登録
        </Button>
      </Link>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>レストラン名</Th>
              <Th textAlign="center">
                共有テキスト
                <Tooltip label="飲食店が管理画面にログインするための情報をコピーします">
                  <InfoOutlineIcon mx="2px" />
                </Tooltip>
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {restaurants.map((restaurant) => {
              const handleCopy = () => {
                if (!restaurant.tokens[0]) return;
                copyCredentialToClipboard({
                  id: restaurant.id,
                  password: restaurant.tokens[0].token,
                });
                toast({
                  title: "コピーしました",
                  status: "success",
                  duration: 2000,
                });
              };
              return (
                <Tr key={restaurant.id}>
                  <Td>{restaurant.id}</Td>
                  <Td>{restaurant.name}</Td>
                  <Td textAlign="center">
                    <IconButton
                      aria-label="共有テキストコピー"
                      icon={<CopyIcon />}
                      color="white"
                      onClick={handleCopy}
                    />
                  </Td>
                  <Td>
                    <Link
                      href={`https://www.google.com/maps/place/?q=place_id:${restaurant.googleMapPlaceId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ChakraLink isExternal>
                        Googleマップ
                        <ExternalLinkIcon mx="2px" />
                      </ChakraLink>
                    </Link>
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
