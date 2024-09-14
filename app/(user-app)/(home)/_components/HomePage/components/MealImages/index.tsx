"use client";

import { MealPreview } from "@/components/meal/MealPreview";
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
      <Text fontSize="xs">Watt限定メニュー</Text>
      <HStack>
        {meals.map((meal) => (
          <MealPreview key={meal.id} meal={meal} />
        ))}
      </HStack>
    </VStack>
  );
}
