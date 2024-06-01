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
  Divider,
  useDisclosure,
  InputGroup,
  InputRightElement,
  Input
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Prisma } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Stripe from "stripe";
import { ChangeEventHandler, useState } from "react";
import { createPaymentIntent } from "@/actions/payment-intent";
import { ConfirmModal } from "@/components/confirm-modal";

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
  const [price, setPrice] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const { isOpen: isErrorMessageOpen, onOpen: onErrorMessageOpen, onClose: onErrorMessageClose } = useDisclosure();

  const handlePriceChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === "") {
      setPrice(0);
      return;
    }
    const numberValue = Number(e.target.value);
    if (isNaN(numberValue) || numberValue === 0) return;
    setPrice(numberValue);
  };

  const handleClickNext = () => {
    if (!selectedPaymentMethod || price <= 0) return;
    setIsPosting(true);
    createPaymentIntent({
      orderId: order.id,
      amount: price,
      paymentMethodId: selectedPaymentMethod
    })
      .then((paymentId) => {
        setIsPosting(false);
        router.push(`/orders/${order.id}/payments/${paymentId}`);
      })
      .catch(() => {
        setIsPosting(false);
        onErrorMessageOpen();
      });
  };

  return (
    <>
      <Flex direction="column" h="full" p={4}>
        <VStack alignItems="start" spacing={4}>
          <Heading>支払い金額の入力</Heading>
          <Heading size="md">{order.meal.restaurant.name}</Heading>
          <Text>支払い金額（税込）を入力 </Text>
          <HStack w="full">
            <InputGroup>
              <Input
                variant="flushed"
                size="lg"
                onInput={handlePriceChange}
                value={price}
                textAlign="right"
                fontSize="xx-large"
                fontWeight="bold"
                min={0}
                autoFocus
              />
              <InputRightElement alignItems="self-end">円</InputRightElement>
            </InputGroup>
          </HStack>
          <Divider />
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
                      {selectedPaymentMethod === paymentMethod.id && <CheckCircleIcon color="brand.400" boxSize={5} />}
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
        <Button
          size="lg"
          w="full"
          onClick={handleClickNext}
          isLoading={isPosting}
          isDisabled={price <= 0 || selectedPaymentMethod === undefined}
        >
          次へ
        </Button>
      </Flex>
      <ConfirmModal
        isOpen={isErrorMessageOpen}
        title="エラーが発生しました"
        confirmButton={{
          label: "OK",
          onClick: onErrorMessageClose
        }}
        onClose={onErrorMessageClose}
      />
    </>
  );
}
