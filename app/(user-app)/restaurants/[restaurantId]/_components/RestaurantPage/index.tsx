"use client";

import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { Box, HStack, Heading, VStack, Text, Divider } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { RestaurantInfo } from "../RestaurantInfo";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{
    include: { meals: true; googleMapPlaceInfo: { select: { url: true } }; paymentOptions: true };
  }>;
};

export function RestaurantPage({ restaurant }: Props) {
  return (
    <VStack w="full" p={4} alignItems="start" spacing={4}>
      <RestaurantInfo restaurant={restaurant} />
      <Divider borderColor="black" />
      <Box>
        <Heading size="md">推しメシ</Heading>
        <Text fontSize="xs">食べたい推しメシを選択してください</Text>
      </Box>
      <HStack overflowX="auto" maxW="full" className="hidden-scrollbar">
        {restaurant.meals.map((meal) => (
          <MealPreviewBox key={meal.id} meal={meal} href={`${restaurant.id}/meals/${meal.id}`} />
        ))}
      </HStack>
    </VStack>
  );
}
