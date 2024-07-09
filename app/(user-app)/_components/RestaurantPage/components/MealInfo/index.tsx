"use client";

import { Box, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import { MealWithItems } from "../../types/MealWithItems";
import { MealItemInfo } from "../MealItemInfo";

type Props = {
  meal: MealWithItems;
  selectedOptions: (string | null)[];
  onOptionChange: (index: number, value: string) => void;
};

export function MealInfo({ meal, selectedOptions, onOptionChange }: Props) {
  return (
    <VStack w="full" alignItems="start" spacing={2}>
      <Box w="full">
        <Heading size="md">{meal.title}</Heading>
        <Heading size="md">{meal.price.toLocaleString("ja-JP")}円</Heading>
        <Text fontSize="sm" whiteSpace="pre-wrap" mt={2}>
          {meal.description}
        </Text>
      </Box>
      <Divider borderColor="blackAlpha.400" />
      <Heading size="sm">セット内容</Heading>
      <VStack alignItems="start" spacing={1} w="full">
        {meal.items.map((item, index) => {
          const handleChange = (value: string) => {
            onOptionChange(index, value);
          };
          return (
            <MealItemInfo
              key={item.id}
              mealItem={item}
              selectedOption={selectedOptions[index]}
              onOptionChange={handleChange}
            />
          );
        })}
      </VStack>
    </VStack>
  );
}
