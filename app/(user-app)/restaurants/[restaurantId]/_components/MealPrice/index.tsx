"use client";

import { VStack, Text, Flex, Spacer, Box, HStack } from "@chakra-ui/react";
import NextImage from "next/image";
import { MealWithItems } from "../../_types/MealWithItems";

type Props = {
  meal: MealWithItems;
  selectedOptions: (string | null)[];
  titlePrefix?: string;
};

export function MealPrice({ meal, selectedOptions, titlePrefix }: Props) {
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
            <Flex w="full" alignItems="flex-start" fontSize="sm" key={item.id}>
              <Text>
                {item.title}
                {selectedOption && ` (${selectedOption.title})`}
              </Text>
              <Spacer />
              <Text>{(item.price + (selectedOption?.extraPrice ?? 0)).toLocaleString("ja-JP")}円</Text>
            </Flex>
          );
        })}
      </Box>
      <Box w="full">
        <Flex>
          <Spacer />
          <Text as="p" fontSize="sm">
            <Text as="span" mr="2">
              単品合計価格
            </Text>
            <Text as="span" textDecorationLine="line-through">
              {(meal.items.reduce((acc, item) => acc + item.price, 0) + totalExtraPrice).toLocaleString("ja-JP")}円
            </Text>
          </Text>
        </Flex>
        <Flex fontWeight="bold" textColor="brand.400" mt={1}>
          <Spacer />
          <HStack spacing={0} mr={2}>
            <NextImage src="/watt-logo.png" alt="Watt" width={40} height={31} />
            <Text fontSize="sm" as="span" ml={1}>
              価格
            </Text>
          </HStack>
          <Text as="span">{(meal.price + totalExtraPrice).toLocaleString("ja-JP")}円</Text>
        </Flex>
      </Box>
    </VStack>
  );
}
