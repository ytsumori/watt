"use client";

import {
  Box,
  HStack,
  Heading,
  NumberInput,
  NumberInputField,
  Table,
  TableContainer,
  Text,
  Thead,
  Tr,
  Th,
  Tbody,
  VStack,
  Button,
  Td,
  Spacer,
  Flex
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Prisma } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Stripe from "stripe";
import { useState } from "react";
import { createPaymentIntent } from "@/actions/payment-intent";

type Props = {
  order: Prisma.OrderGetPayload<{ include: { meal: { include: { restaurant: true } } } }>;
  paymentMethods: Stripe.PaymentMethod[];
};

export function NewPaymentPage({ order, paymentMethods }: Props) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(
    paymentMethods.length === 1 ? paymentMethods[0].id : undefined
  );
  const router = useRouter();
  const pathname = usePathname();
  const [additionalPrice, setAdditionalPrice] = useState<number>();
  const [isPosting, setIsPosting] = useState(false);

  const handleAdditionalPriceChange = (value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue === 0) setAdditionalPrice(undefined);
    setAdditionalPrice(numberValue);
  };

  const handleClickNext = () => {
    if (!selectedPaymentMethod) return;
    setIsPosting(true);
    createPaymentIntent({
      orderId: order.id,
      additionalAmount: additionalPrice ?? 0,
      paymentMethodId: selectedPaymentMethod
    }).then((paymentId) => {
      setIsPosting(false);
      router.push(`/orders/${order.id}/payments/${paymentId}`);
    });
  };

  return (
    <Flex direction="column" h="full" p={4}>
      <VStack alignItems="start" spacing={4}>
        <Heading>支払い金額の入力</Heading>
        <Heading size="md">{order.meal.restaurant.name}</Heading>
        <Text>推しメシ代金</Text>
        <Heading size="md">{order.meal.price.toLocaleString("ja-JP")}円</Heading>
        <Text size="md">追加料金</Text>
        <HStack w="full">
          <NumberInput
            size="lg"
            min={0}
            onChange={handleAdditionalPriceChange}
            value={additionalPrice ? additionalPrice.toLocaleString("ja-JP") : ""}
          >
            <NumberInputField />
          </NumberInput>
          <Text>円</Text>
        </HStack>
        <Box>
          <Text>支払い方法</Text>
          <Text fontSize="xs">お支払い方法を選択してください</Text>
        </Box>
        <TableContainer minW="full">
          <Table variant="simple" size="sm" __css={{ th: { paddingX: 0 }, td: { paddingX: 0 } }} w="full">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>ブランド</Th>
                <Th>カード番号</Th>
                <Th>有効期限</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paymentMethods.map((paymentMethod) => (
                <Tr key={paymentMethod.id} onClick={() => setSelectedPaymentMethod(paymentMethod.id)}>
                  <Td>
                    {selectedPaymentMethod === paymentMethod.id && <CheckCircleIcon color="orange.400" boxSize={5} />}
                  </Td>
                  <Td>{paymentMethod.card?.brand}</Td>
                  <Td>**** **** **** {paymentMethod.card?.last4}</Td>
                  <Td>
                    {paymentMethod.card?.exp_month}/{paymentMethod.card?.exp_year}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Button variant="outline" as={NextLink} href={`/payment-methods/new?redirect_pathname=${pathname}`}>
          決済方法を登録
        </Button>
      </VStack>
      <Spacer />
      <Button size="lg" w="full" onClick={handleClickNext} isLoading={isPosting}>
        次へ
      </Button>
    </Flex>
  );
}
