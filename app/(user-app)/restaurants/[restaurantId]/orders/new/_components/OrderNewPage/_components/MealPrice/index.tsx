"use client";

import { VStack, Text, Flex, Spacer, Box, HStack } from "@chakra-ui/react";
import { MealWithItems } from "../../types/MealWithItems";

type Props = {
  meal: MealWithItems;
  selectedOptions: (string | null)[];
  titlePrefix?: string;
  isDiscounted: boolean;
};

export function MealPrice({ meal, selectedOptions, titlePrefix, isDiscounted }: Props) {
  const totalExtraPrice = meal.items.reduce((acc, item, itemIndex) => {
    const selectedOption = item.options.find((option) => option.id === selectedOptions[itemIndex]);
    return acc + (selectedOption?.extraPrice ?? 0);
  }, 0);
  return (
    <VStack w="full" spacing={0}>
      <Flex w="full">
        <Text fontWeight="bold">
          {titlePrefix ?? ""}
          {meal.title}
        </Text>
      </Flex>
      <Box width="full">
        {meal.items.map((item, itemIndex) => {
          const selectedOption = item.options.find((option) => option.id === selectedOptions[itemIndex]);
          return (
            <Text fontSize="sm" key={item.id}>
              {item.title}
              {selectedOption && ` (${selectedOption.title})`}
            </Text>
          );
        })}
      </Box>
      <Box w="full">
        {isDiscounted ? (
          <>
            <Flex>
              <Spacer />
              <Text as="p" fontSize="sm">
                <Text as="span" mr="2">
                  定価
                </Text>
                <Text as="span" textDecorationLine="line-through">
                  {(meal.listPrice! + totalExtraPrice).toLocaleString("ja-JP")}円
                </Text>
              </Text>
            </Flex>
            <Flex fontWeight="bold" textColor="brand.400">
              <Spacer />
              <Text fontSize="sm" as="span" mr={2}>
                スキ割価格
              </Text>
              <Text as="span">{(meal.price + totalExtraPrice).toLocaleString("ja-JP")}円</Text>
            </Flex>
          </>
        ) : (
          <>
            <Flex fontWeight="bold">
              <Spacer />
              <Text as="span">{(meal.listPrice! + totalExtraPrice).toLocaleString("ja-JP")}円</Text>
            </Flex>
          </>
        )}
      </Box>
    </VStack>
  );
}
