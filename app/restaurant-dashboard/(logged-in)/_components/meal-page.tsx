"use client";

import { getMeals } from "@/actions/meal";
import { Meal } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { RestaurantIdContext } from "./restaurant-id-provider";
import { MealList } from "@/components/meal/MealList";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export function MealPage() {
  const restaurantId = useContext(RestaurantIdContext);

  const [meals, setMeals] = useState<Meal[]>();

  useEffect(() => {
    getMeals({ where: { restaurantId }, orderBy: { price: "asc" } }).then((meals) => setMeals(meals));
  }, [restaurantId]);

  if (!meals)
    return (
      <Center h="full" w="full">
        <VStack>
          <Spinner />
          <Text>推しメシを取得中</Text>
        </VStack>
      </Center>
    );

  return <MealList restaurantId={restaurantId} defaultMeals={meals} />;
}
