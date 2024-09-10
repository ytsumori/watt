"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { MealPreviewImage } from "../MealPreviewImage";

type Props = {
  meal: Prisma.MealGetPayload<{
    select: {
      id: true;
      title: true;
      price: true;
      listPrice: true;
      imagePath: true;
    };
  }>;
  onClick?: () => void;
};

export function MealPreview({ meal, onClick }: Props) {
  return (
    <VStack key={meal.id} alignItems="start" spacing={0} onClick={onClick}>
      <MealPreviewImage src={meal.imagePath} alt={`meal-${meal.id}`} />
      <Text noOfLines={1} fontSize="xs" mt={1} fontWeight="bold">
        {meal.title}
      </Text>
      <Box lineHeight="normal">
        <Text as="span" textDecorationLine="line-through" fontSize="xs">
          ¥{meal.listPrice.toLocaleString("ja-JP")}
        </Text>
        <Text as="span" fontSize="md" fontWeight="bold" color="brand.400" ml={1}>
          ¥{meal.price.toLocaleString("ja-JP")}
        </Text>
      </Box>
    </VStack>
  );
}
