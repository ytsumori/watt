"use client";

import { Box, Button, Divider, Flex, Heading, Spacer, Text, VStack } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

type Props = {
  order: Prisma.OrderGetPayload<{
    select: {
      orderTotalPrice: true;
      meals: {
        select: {
          id: true;
          meal: { select: { title: true; price: true } };
        };
      };
    };
  }>;
};

export function PriceSection({ order }: Props) {
  return (
    <VStack alignItems="start" w="full">
      <Heading size="sm">注文内容</Heading>
      {order.meals.map((orderMeal) => (
        <Box key={orderMeal.id} w="full">
          <Flex w="full">
            <Text>{orderMeal.meal.title}</Text>
            <Spacer />
            <Text fontWeight="bold" whiteSpace="nowrap">
              {orderMeal.meal.price.toLocaleString("ja-JP")} 円
            </Text>
          </Flex>
          <Button variant="outline" size="xs">
            セット詳細
          </Button>
        </Box>
      ))}
      <Divider />
      <Heading size="sm" alignSelf="self-end">
        合計 {order.orderTotalPrice.toLocaleString("ja-JP")}円
      </Heading>
    </VStack>
  );
}
