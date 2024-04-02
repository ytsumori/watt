"use client";

import { Box, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { OrdersCsvDownloadButton } from "./OrdersCsvDownloadButton";
import { translateOrderStatus } from "@/lib/prisma/translate-enum";
import { format } from "date-fns";
import { DateRangeEditor } from "./DateRangeEditor";
import { DownloadableOrder } from "./OrdersCsvDownloadButton/type";

type Props = {
  orders: DownloadableOrder[];
  dateRange: { start: Date; end: Date };
};

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
              <Th>CSVダウンロード</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>{format(order.createdAt, "yyyy/MM/dd")}</Td>
                <Td>{order.providerPaymentId}</Td>
                <Td>{order.meal.restaurant.name}</Td>
                <Td>{order.price.toLocaleString("ja-JP")}円</Td>
                <Td>{order.restaurantProfitPrice.toLocaleString("ja-JP")}円</Td>
                <Td>{translateOrderStatus(order.status)}</Td>
                <Td>{order.isDownloaded ? "済" : "未"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
