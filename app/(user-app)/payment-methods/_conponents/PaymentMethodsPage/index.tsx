"use client";

import { detachPaymentMethod } from "@/actions/payment-method";
import { Box, Button, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import Link from "next/link";
import Stripe from "stripe";

type Props = {
  paymentMethods: Stripe.PaymentMethod[];
};

export function PaymentMethodsPage({ paymentMethods }: Props) {
  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    if (window.confirm("本当に削除しますか？")) {
      detachPaymentMethod({ paymentMethodId }).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <VStack w="full" p={4} alignItems="start" spacing={3}>
      <Box>
        <Heading>支払い方法</Heading>
      </Box>
      <TableContainer minW="full">
        <Table variant="simple" size="sm" __css={{ th: { padding: 0 }, td: { padding: 0 } }} w="full">
          <Thead>
            <Tr>
              <Th>ブランド</Th>
              <Th>カード番号</Th>
              <Th>有効期限</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paymentMethods.map((paymentMethod) => (
              <Tr key={paymentMethod.id}>
                <Td>{paymentMethod.card?.brand}</Td>
                <Td>**** **** **** {paymentMethod.card?.last4}</Td>
                <Td>
                  {paymentMethod.card?.exp_month}/{paymentMethod.card?.exp_year}
                </Td>
                <Td textAlign="end">
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={() => handleDeletePaymentMethod(paymentMethod.id)}
                  >
                    削除
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button as={Link} href="/payment-methods/new">
        新しい支払い方法を追加する
      </Button>
    </VStack>
  );
}
