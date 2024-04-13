"use client";

import { Heading, VStack } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

import { MealList } from "@/components/meal/MealList";
import { RestaurantBankAccount } from "./restaurant-bank-account";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{ select: { id: true; name: true; bankAccount: true; meals: true } }>;
};

export function RestaurantDetailPage({ restaurant }: Props) {
  return (
    <VStack p={10} alignItems="start" spacing={5}>
      <Heading as="h1" size="lg">
        {restaurant.name}
      </Heading>
      {restaurant.bankAccount && <RestaurantBankAccount restaurantBankAccount={restaurant.bankAccount} />}
      <MealList restaurantId={restaurant.id} defaultMeals={restaurant.meals} />
    </VStack>
  );
}
