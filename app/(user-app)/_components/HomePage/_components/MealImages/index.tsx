"use client";

import { MealPreviewBox } from "@/components/meal/MealPreviewBox";

import { HStack, Text, VStack } from "@chakra-ui/react";
import { RestaurantStatus } from "@prisma/client";

type Props = {
  restaurantId: string;
  meals: {
    id: string;
    price: number;
    listPrice: number;
    imagePath: string;
    title: string;
  }[];
  status: RestaurantStatus;
};

export function MealImages({ restaurantId, meals, status }: Props) {
  return (
    <VStack alignItems="start" spacing={0}>
      <Text fontSize="xs">セットメニュー</Text>
      <HStack>
        {meals.map((meal) => (
          <MealPreviewBox
            key={meal.id}
            meal={meal}
            href={`restaurants/${restaurantId}/meals/${meal.id}`}
            isRouter
            isDiscounted={status === "OPEN"}
          />
        ))}
      </HStack>
    </VStack>
  );
}
