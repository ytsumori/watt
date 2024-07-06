"use client";

import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { getRestaurantInteriorImageUrl } from "@/utils/image/getRestaurantInteriorImageUrl";
import { HStack, Image } from "@chakra-ui/react";

type Props = {
  restaurantId: string;
  meals: {
    id: string;
    price: number;
    imagePath: string;
    title: string;
  }[];
  interiorImagePath?: string;
};

export function ImageStacks({ restaurantId, meals, interiorImagePath }: Props) {
  const firstMeal = meals.at(0);
  if (!firstMeal) return null;

  const interiorImageUrl = interiorImagePath ? getRestaurantInteriorImageUrl(interiorImagePath) : undefined;

  const restMeals = meals.slice(1);
  return (
    <HStack px={4} overflowX="auto" className="hidden-scrollbar">
      <MealPreviewBox meal={firstMeal} href={`restaurants/${restaurantId}?mealId=${firstMeal.id}`} isRouter />
      {interiorImageUrl && (
        <Image
          minW="150px"
          maxW="150px"
          src={interiorImageUrl}
          objectFit="cover"
          aspectRatio={1 / 1}
          borderRadius={8}
          loading="lazy"
          alt={`interior-image-${restaurantId}`}
        />
      )}
      {restMeals.map((meal) => (
        <MealPreviewBox key={meal.id} meal={meal} href={`restaurants/${restaurantId}?mealId=${meal.id}`} isRouter />
      ))}
    </HStack>
  );
}
