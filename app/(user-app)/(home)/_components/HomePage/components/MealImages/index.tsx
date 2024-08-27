"use client";

import { MealPreviewBox } from "@/components/meal/MealPreviewBox";

import { HStack, Text, VStack } from "@chakra-ui/react";

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
          <MealPreviewBox key={meal.id} meal={meal} href={`meals/${meal.id}`} isRouter />
        ))}
      </HStack>
    </VStack>
  );
}
