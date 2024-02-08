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
  Tooltip,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import NextLink from "next/link";

type Props = {
  payments: Prisma.PaymentGetPayload<{
    include: {
      order: {
        include: {
          meal: {
            include: { restaurant: true };
          };
          user: true;
        };
      };
    };
  }>[];
};

export function PaymentsPageClient({ payments }: Props) {
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
              <Th>金額</Th>
              <Th>ステータス</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((payment) => (
              <Tr key={payment.id}>
                <Td>{payment.paymentProvider}</Td>
                <Td>{payment.providerPaymentId}</Td>
                <Td>{payment.order.meal.restaurant.name}</Td>
                <Td>{payment.amount.toLocaleString("ja-JP")}円</Td>
                <Td>{payment.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
