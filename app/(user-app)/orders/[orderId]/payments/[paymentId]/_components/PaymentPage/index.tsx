"use client";

import { capturePaymentIntent } from "@/actions/payment-intent";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  payment: Prisma.PaymentGetPayload<{
    include: { order: { select: { meal: { select: { restaurant: { select: { name: true } } } } } } };
  }>;
};

export function PaymentPage({ payment }: Props) {
  const [isPriceFlipped, setIsPriceFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(payment.completedAt !== null);

  useEffect(() => {
    if (!isPriceFlipped) {
      setTimeout(() => setIsPriceFlipped(true), 500);
    }
  }, [isPriceFlipped]);

  const handlePay = () => {
    capturePaymentIntent({ paymentId: payment.id })
      .then((status) => {
        if (status === "succeeded") {
          setIsCompleted(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isCompleted) {
    return (
      <Flex direction="column" h="full" p={4}>
        <Center h="full">
          <Heading size="md">支払いが完了しました</Heading>
        </Center>
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="full" p={4}>
      <Box h="40%" transform={isPriceFlipped ? "rotateZ(180deg)" : ""} transitionDuration="0.5s">
        <Heading size="md">{payment.order.meal.restaurant.name}</Heading>
        <Center h="full">
          <Heading fontSize="80px">
            {payment.totalAmount.toLocaleString("ja-JP")}
            <Text as="span" fontSize="20px">
              円
            </Text>
          </Heading>
        </Center>
      </Box>
      <Button mt={6} size="lg" w="full" onClick={handlePay}>
        支払う
      </Button>
    </Flex>
  );
}
