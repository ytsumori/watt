"use client";

import { Box, Heading } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

import { MealList } from "@/components/meal/meal-list";
import { RestaurantBankAccount } from "./restaurant-bank-account";

type Props = {
  restaurant: Prisma.RestaurantGetPayload<{ select: { id: true; name: true; bankAccount: true; meals: true } }>;
};

export function RestaurantDetailPage({ restaurant }: Props) {
  return (
    <Box p={10}>
      <Heading as="h1" size="lg">
        {restaurant.name}
      </Heading>
      <MealList restaurantId={restaurant.id} defaultMeals={restaurant.meals} />
      {restaurant.bankAccount && <RestaurantBankAccount restaurantBankAccount={restaurant.bankAccount} />}
    </Box>
  );
}
