"use client";

import { getRestaurantStatus } from "@/utils/restaurant-status";
import { Heading, Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FC } from "react";

type Props = {
  meal: Prisma.MealGetPayload<{
    include: {
      restaurant: { include: { fullStatuses: { select: { easedAt: true } } } };
      items: { include: { options: true } };
    };
  }>;
};

export const MealPrice: FC<Props> = ({ meal }) => {
  const isDiscounted =
    getRestaurantStatus({
      isOpen: meal.restaurant.isOpen,
      isFull: meal.restaurant.fullStatuses.some((status) => status.easedAt === null)
    }) === "open";

  return (
    <>
      {isDiscounted ? (
        <>
          <Text textDecorationLine="line-through" fontSize="md" as="span">
            {meal.listPrice!.toLocaleString("ja-JP")}円
          </Text>
          <Heading size="md" fontWeight="bold" color="brand.400" as="span" ml={2}>
            {meal.price.toLocaleString("ja-JP")}円
          </Heading>
        </>
      ) : (
        <Heading size="md">{meal.listPrice!.toLocaleString("ja-JP")}円</Heading>
      )}
    </>
  );
};
