"use client";

import { Box, Flex, Heading, Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { translateOrderStatus } from "@/lib/prisma/translate-enum";
import { format } from "date-fns";
import { DownloadableOrder } from "../OrdersCsvDownloadButton/type";
import { DateRangeEditor } from "../DateRangeEditor";
import { OrdersCsvDownloadButton } from "../OrdersCsvDownloadButton";
import NextLink from "next/link";

type Props = {
  orders: DownloadableOrder[];
  dateRange: { start: Date; end: Date };
};

export function OrdersPageClient({ orders, dateRange }: Props) {
  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        決済一覧
      </Heading>
      <Flex marginBottom={5} alignItems="center" flexWrap="wrap">
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
              <Th>振込先名義</Th>
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
                <Td>
                  <Link as={NextLink} href={`restaurants/${order.meal.restaurant.id}`}>
                    {order.meal.restaurant.name}
                  </Link>
                </Td>
                <Td>{order.meal.restaurant.bankAccount?.holderName ?? "未登録"}</Td>
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
