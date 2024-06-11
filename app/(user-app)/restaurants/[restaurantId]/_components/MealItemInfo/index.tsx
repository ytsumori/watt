"use client";

import { Box, SimpleGrid, Text, useRadioGroup } from "@chakra-ui/react";
import { MealWithItems } from "../../_types/MealWithItems";
import { OptionRadioCard } from "../OptionRadioCard";

type Props = {
  mealItem: MealWithItems["items"][number];
  selectedOption: string | null;
  onOptionChange: (value: string) => void;
};

export function MealItemInfo({ mealItem, selectedOption, onOptionChange }: Props) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    onChange: onOptionChange,
    value: selectedOption ?? ""
  });
  const group = getRootProps();
  return (
    <Box key={mealItem.id} w="full">
      <Text fontSize="sm" as="b">
        {mealItem.title}
      </Text>
      <Text whiteSpace="pre-wrap" fontSize="xs" color="blackAlpha.700">
        {mealItem.description}
      </Text>
      {mealItem.options.length > 0 && (
        <>
          {!selectedOption && (
            <Text fontSize="xs" color="brand.400" fontWeight="bold">
              お選びください
            </Text>
          )}
          <SimpleGrid columns={2} spacing={3} {...group} w="full">
            {mealItem.options.map((option) => {
              const radio = getRadioProps({ value: option.id });
              return (
                <OptionRadioCard key={option.id} {...radio}>
                  <Text fontSize="xs" color="blackAlpha.700">
                    {option.title}
                  </Text>
                  <Text fontSize="xs" color="blackAlpha.500" ml={1}>
                    +¥{option.extraPrice.toLocaleString("ja-JP")}
                  </Text>
                </OptionRadioCard>
              );
            })}
          </SimpleGrid>
        </>
      )}
    </Box>
  );
}
