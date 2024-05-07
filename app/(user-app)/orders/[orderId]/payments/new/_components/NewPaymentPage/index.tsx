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
  Flex,
  Center
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Prisma } from "@prisma/client";
import { usePathname } from "next/navigation";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Stripe from "stripe";
import { useEffect, useState } from "react";

type Props = {
  order: Prisma.OrderGetPayload<{ include: { meal: { include: { restaurant: true } } } }>;
  paymentMethods: Stripe.PaymentMethod[];
};

export function NewPaymentPage({ order, paymentMethods }: Props) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(
    paymentMethods.length === 1 ? paymentMethods[0].id : undefined
  );
  const pathname = usePathname();
  const [additionalPrice, setAdditionalPrice] = useState<number>();
  const [isPaying, setIsPaying] = useState(false);
  const [isPriceFlipped, setIsPriceFlipped] = useState(false);

  useEffect(() => {
    if (isPaying) {
      setTimeout(() => setIsPriceFlipped(true), 500);
    } else {
      setIsPriceFlipped(false);
    }
  }, [isPaying]);

  const handleAdditionalPriceChange = (value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue === 0) setAdditionalPrice(undefined);
    setAdditionalPrice(numberValue);
  };

  return (
    <Flex direction="column" h="full" p={4}>
      {isPaying ? (
        <>
          <Box h="40%" transform={isPriceFlipped ? "rotateZ(180deg)" : ""} transitionDuration="0.5s">
            <Heading size="md">{order.meal.restaurant.name}</Heading>
            <Center h="full">
              <Heading fontSize="80px">
                {(additionalPrice ? order.meal.price + additionalPrice : order.meal.price).toLocaleString("ja-JP")}
                <Text as="span" fontSize="20px">
                  円
                </Text>
              </Heading>
            </Center>
          </Box>
          <Button mt={6} size="lg" w="full" onClick={() => setIsPaying(true)}>
            支払う
          </Button>
        </>
      ) : (
        <>
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
                        {selectedPaymentMethod === paymentMethod.id && (
                          <CheckCircleIcon color="orange.400" boxSize={5} />
                        )}
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
          <Button size="lg" w="full" onClick={() => setIsPaying(true)}>
            次へ
          </Button>
        </>
      )}
    </Flex>
  );
}
