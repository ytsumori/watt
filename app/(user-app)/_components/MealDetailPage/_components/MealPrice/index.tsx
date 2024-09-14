"use client";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FC } from "react";

type Props = {
  meal: Prisma.MealGetPayload<{ select: { price: true; listPrice: true } }>;
};

export const MealPrice: FC<Props> = ({ meal }) => {
  return (
    <Flex flexDir="column">
      <Text textDecorationLine="line-through" fontSize="md" minW="max-content">
        {meal.listPrice!.toLocaleString("ja-JP")}円
      </Text>
      <Heading size="md" fontWeight="bold" color="brand.400" as="p" minW="max-content">
        {meal.price.toLocaleString("ja-JP")}円
      </Heading>
    </Flex>
  );
};
