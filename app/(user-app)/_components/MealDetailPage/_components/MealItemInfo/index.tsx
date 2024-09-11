"use client";

import { FC } from "react";
import { Box, Text } from "@chakra-ui/react";
import { MealItem } from "@prisma/client";

type Props = {
  mealItem: MealItem;
};

export const MealItemInfo: FC<Props> = ({ mealItem }) => {
  return (
    <Box key={mealItem.id} w="full">
      <Text fontSize="sm">{mealItem.title}</Text>
      <Text whiteSpace="pre-wrap" fontSize="xs" color="blackAlpha.700">
        {mealItem.description}
      </Text>
    </Box>
  );
};
