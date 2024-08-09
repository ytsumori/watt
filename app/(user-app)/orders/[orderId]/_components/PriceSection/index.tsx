"use client";

import { Box, Button, Divider, Flex, Heading, Spacer, Text, VStack } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import NextLink from "next/link";

type Props = {
  order: Prisma.OrderGetPayload<{
    include: {
      meals: {
        include: {
          meal: { select: { title: true; price: true; listPrice: true } };
          options: {
            select: {
              id: true;
              mealItemOption: {
                select: {
                  title: true;
                  extraPrice: true;
                  mealItem: { select: { title: true } };
                };
              };
            };
          };
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
              {(order.isDiscounted ? orderMeal.meal.price : orderMeal.meal.listPrice).toLocaleString("ja-JP")} 円
            </Text>
          </Flex>
          {orderMeal.options.map((option) => (
            <Flex w="full" key={option.id}>
              <Text fontSize="sm">
                ・{option.mealItemOption.mealItem.title} {option.mealItemOption.title}
              </Text>
              {option.mealItemOption.extraPrice !== 0 && (
                <>
                  <Spacer />
                  <Text fontSize="sm">
                    {option.mealItemOption.extraPrice > 0 && "+"}
                    {option.mealItemOption.extraPrice.toLocaleString("ja-JP")}円
                  </Text>
                </>
              )}
            </Flex>
          ))}
          <Button variant="outline" as={NextLink} href={`/order-meals/${orderMeal.id}`} size="xs">
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
