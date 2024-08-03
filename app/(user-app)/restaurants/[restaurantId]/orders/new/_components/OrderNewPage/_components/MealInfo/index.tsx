"use client";

import { Box, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import { MealWithItems } from "../../types/MealWithItems";
import { MealItemInfo } from "../MealItemInfo";

type Props = {
  meal: MealWithItems;
  selectedOptions: (string | null)[];
  onOptionChange: (index: number, value: string) => void;
  isDiscounted: boolean;
};

export function MealInfo({ meal, selectedOptions, onOptionChange, isDiscounted }: Props) {
  return (
    <VStack w="full" alignItems="start" spacing={2}>
      <Box w="full">
        <Heading size="md">{meal.title}</Heading>
        {isDiscounted ? (
          <>
            <Text textDecorationLine="line-through" fontSize="md" as="span">
              {meal.listPrice!.toLocaleString("ja-JP")}円
            </Text>
            <Heading size="md" fontWeight="bold" color="brand.400" as="span" ml={2}>
              {meal.price.toLocaleString("ja-JP")}円
            </Heading>
          </>
        ) : (
          <Heading size="md">{meal.listPrice!.toLocaleString("ja-JP")}円</Heading>
        )}
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
