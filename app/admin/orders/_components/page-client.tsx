"use client";

import { translateOrderStatus } from "@/lib/prisma/translate-enum";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

type Props = {
  orders: Prisma.OrderGetPayload<{
    include: {
      meal: {
        include: { restaurant: true };
      };
      user: true;
    };
  }>[];
};

export function OrdersPageClient({ orders }: Props) {
  const toast = useToast();
  return (
    <Box p={6}>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>決済方法</Th>
              <Th>決済ID</Th>
              <Th>レストラン名</Th>
              <Th>決済金額</Th>
              <Th>振込金額</Th>
              <Th>ステータス</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.paymentProvider}</Td>
                <Td>{order.providerPaymentId}</Td>
                <Td>{order.meal.restaurant.name}</Td>
                <Td>{order.price.toLocaleString("ja-JP")}円</Td>
                <Td>{order.restaurantProfitPrice.toLocaleString("ja-JP")}円</Td>
                <Td>{translateOrderStatus(order.status)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
