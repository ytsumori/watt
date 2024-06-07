"use client";

import { HStack } from "@chakra-ui/react";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { Prisma } from "@prisma/client";
import { CheckIcon } from "@chakra-ui/icons";

type Props = {
  meals: Prisma.MealGetPayload<{ include: { items: true } }>[];
  selectedMealId?: string;
  onSelectMeal: (meal: Prisma.MealGetPayload<{ include: { items: true } }>) => void;
  additionalBox?: JSX.Element;
};

export function MealCarousel({ meals, selectedMealId, onSelectMeal, additionalBox }: Props) {
  return (
    <HStack overflowX="auto" maxW="full" className="hidden-scrollbar">
      {meals.map((meal) => {
        const isSelected = meal.id === selectedMealId;
        return (
          <MealPreviewBox
            key={meal.id}
            meal={meal}
            onClick={() => onSelectMeal(meal)}
            borderWidth={isSelected ? 4 : 0}
            borderColor="brand.400"
            isLabelHidden={isSelected}
          >
            {isSelected && (
              <CheckIcon
                position="absolute"
                top={0}
                right={0}
                backgroundColor="brand.400"
                color="white"
                boxSize={6}
                borderRadius={6}
                m={1}
                p={1}
                aria-label="checked"
              />
            )}
          </MealPreviewBox>
        );
      })}
      {additionalBox}
    </HStack>
  );
}
