"use client";

import { CopyIcon, InfoOutlineIcon } from "@chakra-ui/icons";
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
  Tooltip,
} from "@chakra-ui/react";
import { Restaurant } from "@prisma/client";
import { copySignUpURL } from "../../_util/clipboard-text";
import { GoogleMapLink } from "../GoogleMapLink";

type Props = {
  restaurants: Restaurant[];
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
                  password: restaurant.password,
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
                  <Td>
                    <Link href={"restaurants/" + restaurant.id}>{restaurant.name}</Link>
                  </Td>
                  <Td textAlign="center">
                    <IconButton aria-label="登録用URLコピー" icon={<CopyIcon />} onClick={handleCopy} />
                  </Td>
                  <Td>
                    <GoogleMapLink googleMapPlaceId={restaurant.googleMapPlaceId} />
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
