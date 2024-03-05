"use client";

import { activateMeal, discardMeal, getMeals } from "@/actions/meal";
import { Button, Heading, VStack, useDisclosure } from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { RestaurantIdContext } from "./restaurant-id-provider";
import { NewMealModal } from "./new-meal-modal";
import { MealCard } from "./meal-card";

export function MealPage() {
  const restaurantId = useContext(RestaurantIdContext);
  const {
    isOpen: isNewFormOpen,
    onOpen: onNewFormOpen,
    onClose: onNewFormClose,
  } = useDisclosure();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [discardedMeals, setDiscardedMeals] = useState<Meal[]>([]);

  useEffect(() => {
    getMeals({ restaurantId }).then((meals) => setMeals(meals));
    getMeals({ restaurantId, isDiscarded: true }).then((discardedMeals) =>
      setDiscardedMeals(discardedMeals)
    );
  }, [restaurantId]);

  const revalidateMeals = () => {
    getMeals({ restaurantId }).then((meals) => setMeals(meals));
    getMeals({ restaurantId, isDiscarded: true }).then((discardedMeals) =>
      setDiscardedMeals(discardedMeals)
    );
  };

  const handleClickDiscard = async (mealId: string) => {
    discardMeal({ id: mealId }).then(() => {
      revalidateMeals();
    });
  };

  const handleClickReopen = async (mealId: string) => {
    activateMeal({ id: mealId }).then(() => {
      revalidateMeals();
    });
  };

  return (
    <>
      <VStack width="full" alignItems="baseline" spacing={6}>
        <Button onClick={onNewFormOpen}>推しメシを登録</Button>
        <Heading size="md">推しメシ(提供中)</Heading>
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            button={
              <Button
                variant="solid"
                colorScheme="red"
                onClick={() => handleClickDiscard(meal.id)}
              >
                取り消す
              </Button>
            }
          />
        ))}
        <Heading size="md" textColor="gray">
          取り消し済み
        </Heading>
        {discardedMeals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            button={
              <Button
                variant="ghost"
                colorScheme="orange"
                onClick={() => handleClickReopen(meal.id)}
              >
                提供再開
              </Button>
            }
          />
        ))}
      </VStack>
      <NewMealModal
        isOpen={isNewFormOpen}
        onClose={onNewFormClose}
        onSubmitComplete={revalidateMeals}
      />
    </>
  );
}
