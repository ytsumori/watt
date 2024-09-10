"use client";

import { Heading, Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FC } from "react";

type Props = {
  meal: Prisma.MealGetPayload<{ select: { price: true; listPrice: true } }>;
};

export const MealPrice: FC<Props> = ({ meal }) => {
  return (
    <>
      <Text textDecorationLine="line-through" fontSize="md" as="span">
        {meal.listPrice!.toLocaleString("ja-JP")}円
      </Text>
      <Heading size="md" fontWeight="bold" color="brand.400" as="span" ml={2}>
        {meal.price.toLocaleString("ja-JP")}円
      </Heading>
    </>
  );
};
