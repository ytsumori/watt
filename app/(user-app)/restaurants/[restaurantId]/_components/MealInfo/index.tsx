"use client";

import { Box, Divider, Heading, Radio, RadioGroup, Text, VStack, useRadioGroup } from "@chakra-ui/react";
import { MealWithItems } from "../../_types/MealWithItems";
import { MealItemInfo } from "../MealItemInfo";

type Props = {
  meal: MealWithItems;
  selectedOptions: (string | null)[];
  onOptionChange: (index: number, value: string) => void;
};

export function MealInfo({ meal, selectedOptions, onOptionChange }: Props) {
  const optionSelectingIndex = meal.items.findIndex(
    (item, index) => item.options.length > 0 && !selectedOptions[index]
  );
  return (
    <VStack w="full" alignItems="start" spacing={2}>
      <Box w="full">
        <Heading size="md">{meal.title}</Heading>
        <Heading size="md">¥{meal.price.toLocaleString("ja-JP")}</Heading>
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
              isSelecting={optionSelectingIndex === index}
              onOptionChange={handleChange}
            />
          );
        })}
      </VStack>
    </VStack>
  );
}
