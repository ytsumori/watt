"use client";

import { activateMeal, discardMeal, getMeals } from "@/actions/meal";
import { MealCard } from "@/components/meal/meal-card";
import { NewMealModal } from "@/components/meal/new-meal-modal";
import { Button, Flex, Heading, VStack, useDisclosure } from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import { useState } from "react";

type Props = {
  restaurantId: string;
  defaultMeals?: Meal[];
};

export function MealList({ restaurantId, defaultMeals }: Props) {
  const { isOpen: isNewFormOpen, onOpen: onNewFormOpen, onClose: onNewFormClose } = useDisclosure();

  const [meals, setMeals] = useState<Meal[]>(defaultMeals?.filter((meal) => !meal.isDiscarded) ?? []);
  const [discardedMeals, setDiscardedMeals] = useState<Meal[]>(defaultMeals?.filter((meal) => meal.isDiscarded) ?? []);

  const revalidateMeals = () => {
    getMeals({ where: { restaurantId } }).then((meals) => {
      setMeals(meals.filter((meal) => !meal.isDiscarded));
      setDiscardedMeals(meals.filter((meal) => meal.isDiscarded));
    });
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
        <Flex gap={3} alignItems="center">
          <Heading size="md">推しメシ</Heading>
          <Button onClick={onNewFormOpen}>登録する</Button>
        </Flex>
        <Heading size="sm">提供中</Heading>
        <Flex wrap="wrap" justify="space-evenly" w="full">
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              button={
                <Button variant="solid" colorScheme="red" onClick={() => handleClickDiscard(meal.id)}>
                  取り消す
                </Button>
              }
            />
          ))}
        </Flex>
        <Heading size="sm" textColor="gray">
          取り消し済み
        </Heading>
        <Flex wrap="wrap" justify="space-evenly" w="full">
          {discardedMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              button={
                <Button variant="ghost" colorScheme="orange" onClick={() => handleClickReopen(meal.id)}>
                  提供再開
                </Button>
              }
            />
          ))}
        </Flex>
      </VStack>
      <NewMealModal
        isOpen={isNewFormOpen}
        onClose={onNewFormClose}
        onSubmitComplete={revalidateMeals}
        restaurantId={restaurantId}
      />
    </>
  );
}
