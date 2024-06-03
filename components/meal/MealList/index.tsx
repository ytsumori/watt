"use client";

import { MealCard } from "@/components/meal/MealCard";
import { Button, Flex, HStack, Heading, VStack, useDisclosure } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { MealFormModal } from "../MealFormModal";
import { activateMeal, discardMeal, getMeals } from "./action";

type MealProp = Prisma.MealGetPayload<{ include: { items: true } }>;

type Props = {
  restaurantId: string;
  defaultMeals?: MealProp[];
};

export function MealList({ restaurantId, defaultMeals }: Props) {
  const { isOpen: isMealFormOpen, onOpen: onMealFormOpen, onClose: onMealFormClose } = useDisclosure();

  const [meals, setMeals] = useState<MealProp[]>(defaultMeals?.filter((meal) => !meal.isDiscarded) ?? []);
  const [discardedMeals, setDiscardedMeals] = useState<MealProp[]>(
    defaultMeals?.filter((meal) => meal.isDiscarded) ?? []
  );
  const [editingMeal, setEditingMeal] = useState<MealProp>();

  const revalidateMeals = () => {
    getMeals(restaurantId).then((meals) => {
      setMeals(meals.filter((meal) => !meal.isDiscarded));
      setDiscardedMeals(meals.filter((meal) => meal.isDiscarded));
    });
  };

  const handleClickEdit = (meal: MealProp) => {
    setEditingMeal(meal);
    onMealFormOpen();
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
          <Button onClick={onMealFormOpen}>登録する</Button>
        </Flex>
        <Heading size="sm">提供中</Heading>
        <Flex wrap="wrap" justify="space-evenly" gap={4}>
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              button={
                <HStack>
                  <Button variant="outline" onClick={() => handleClickEdit(meal)}>
                    編集する
                  </Button>
                  <Button variant="solid" colorScheme="red" onClick={() => handleClickDiscard(meal.id)}>
                    取り消す
                  </Button>
                </HStack>
              }
            />
          ))}
        </Flex>
        <Heading size="sm" textColor="gray">
          取り消し済み
        </Heading>
        <Flex wrap="wrap" justify="space-evenly" gap={4}>
          {discardedMeals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              button={
                <HStack>
                  <Button variant="outline" onClick={() => handleClickEdit(meal)}>
                    編集する
                  </Button>
                  <Button variant="ghost" colorScheme="brand" onClick={() => handleClickReopen(meal.id)}>
                    提供再開
                  </Button>
                </HStack>
              }
            />
          ))}
        </Flex>
      </VStack>
      <MealFormModal
        editingMeal={editingMeal}
        isOpen={isMealFormOpen}
        onClose={() => {
          onMealFormClose();
          setEditingMeal(undefined);
        }}
        onSubmit={() => {
          onMealFormClose();
          setEditingMeal(undefined);
          setTimeout(revalidateMeals, 500);
        }}
        restaurantId={restaurantId}
      />
    </>
  );
}
