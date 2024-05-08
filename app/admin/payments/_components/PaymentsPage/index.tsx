"use client";

import { Box, Flex, Heading, Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { format } from "date-fns";
import { DownloadablePayment } from "../PaymentsCsvDownloadButton/type";
import { DateRangeEditor } from "../DateRangeEditor";

import NextLink from "next/link";
import { PaymentsCsvDownloadButton } from "../PaymentsCsvDownloadButton";

type Props = {
  payments: DownloadablePayment[];
  dateRange: { start: Date; end: Date };
};

export function PaymentsPage({ payments, dateRange }: Props) {
  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        決済一覧
      </Heading>
      <Flex marginBottom={5} alignItems="center" flexWrap="wrap">
        <DateRangeEditor dateRange={dateRange} />
        <PaymentsCsvDownloadButton payments={payments} />
      </Flex>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>決済日時</Th>
              <Th>Stripe 決済ID</Th>
              <Th>レストラン名</Th>
              <Th>振込先名義</Th>
              <Th>決済金額</Th>
              <Th>振込金額</Th>
              <Th>CSVダウンロード</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((payment) => (
              <Tr key={payment.id}>
                <Td>{format(payment.completedAt!!, "yyyy/MM/dd HH:mm")}</Td>
                <Td>{payment.stripePaymentId}</Td>
                <Td>
                  <Link as={NextLink} href={`restaurants/${payment.order.meal.restaurant.id}`}>
                    {payment.order.meal.restaurant.name}
                  </Link>
                </Td>
                <Td>{payment.order.meal.restaurant.bankAccount?.holderName ?? "未登録"}</Td>
                <Td>{payment.totalAmount.toLocaleString("ja-JP")}円</Td>
                <Td>{payment.restaurantProfitPrice.toLocaleString("ja-JP")}円</Td>
                <Td>{payment.isCsvDownloaded ? "済" : "未"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
