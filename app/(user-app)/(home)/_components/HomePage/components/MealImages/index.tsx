"use client";

import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { MealPreviewImage } from "@/components/meal/MealPreviewImage";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";

type Props = {
  meals: {
    id: string;
    price: number;
    listPrice: number;
    imagePath: string;
    title: string;
  }[];
};

export function MealImages({ meals }: Props) {
  return (
    <VStack alignItems="start" spacing={0}>
      <Text fontSize="xs">セットメニュー</Text>
      <HStack>
        {meals.map((meal) => (
          <VStack key={meal.id} alignItems="start" spacing={0}>
            <MealPreviewImage src={meal.imagePath} alt={`meal-${meal.id}`} />
            <>
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
            </>
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
}
