"use client";

import { Prisma } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { MealList } from "@/components/meal/MealList";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { RestaurantIdContext } from "../restaurant-id-provider";
import { getMeals } from "./actions";

export function MealPage() {
  const restaurantId = useContext(RestaurantIdContext);

  const [meals, setMeals] = useState<
    Prisma.MealGetPayload<{
      include: {
        items: { include: { options: true } };
        orders: { select: { id: true } };
      };
    }>[]
  >();

  useEffect(() => {
    getMeals(restaurantId).then((meals) => setMeals(meals));
  }, [restaurantId]);

  if (!meals)
    return (
      <Center h="full" w="full">
        <VStack>
          <Spinner />
          <Text>注文をを取得中</Text>
        </VStack>
      </Center>
    );

  return <MealList restaurantId={restaurantId} defaultMeals={meals} />;
}
