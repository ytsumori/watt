"use client";

import { Box, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { OrdersCsvDownloadButton } from "./OrdersCsvDownloadButton";
import { ConvertedOrderInfo } from "../_util/convertRequiredOrderInfo";
import { translateOrderStatus } from "@/lib/prisma/translate-enum";
import { format } from "date-fns";
import { DateRangeEditor } from "./DateRangeEditor";

type Props = { orders: ConvertedOrderInfo[]; dateRange: { start: Date; end: Date } };

export function OrdersPageClient({ orders, dateRange }: Props) {
  return (
    <Box p={6}>
      <Flex marginTop={10} marginBottom={5} alignItems="center" flexWrap="wrap">
        <DateRangeEditor dateRange={dateRange} />
        <OrdersCsvDownloadButton orders={orders} />
      </Flex>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>作成日</Th>
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
                <Td>{format(order.createdAt, "yyyy/MM/dd")}</Td>
                <Td>{order.providerPaymentId}</Td>
                <Td>{order.restaurantName}</Td>
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
