"use client";

import { getOrderTotalPrice } from "@/lib/prisma/order-total-price";
import { Box, Divider, Flex, Heading, Spacer, Text, VStack } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

type Props = {
  order: Prisma.OrderGetPayload<{
    include: {
      meals: {
        include: {
          meal: { select: { title: true; price: true } };
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
      <Heading size="md">注文内容</Heading>
      {order.meals.map((orderMeal) => (
        <Box key={orderMeal.id} w="full">
          <Flex w="full">
            <Text>
              {orderMeal.meal.title} × {orderMeal.quantity}
            </Text>
            <Spacer />
            <Text fontWeight="bold">¥{orderMeal.meal.price.toLocaleString("ja-JP")}</Text>
          </Flex>
          {orderMeal.options.map((option) => (
            <Flex w="full" key={option.id}>
              <Text>
                ・{option.mealItemOption.mealItem.title} {option.mealItemOption.title}
              </Text>
              {option.mealItemOption.extraPrice > 0 && (
                <>
                  <Spacer />
                  <Text>+¥{option.mealItemOption.extraPrice.toLocaleString("ja-JP")}</Text>
                </>
              )}
            </Flex>
          ))}
        </Box>
      ))}
      <Divider />
      <Heading size="sm" alignSelf="self-end">
        合計 ¥{getOrderTotalPrice(order).toLocaleString("ja-JP")}
      </Heading>
    </VStack>
  );
}
