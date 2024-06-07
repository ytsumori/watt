"use client";

import { Box, Divider, Heading, Radio, RadioGroup, Text, VStack } from "@chakra-ui/react";
import { MealWithItems } from "../../_types/MealWithItems";

type Props = {
  meal: MealWithItems;
};

export function MealInfo({ meal }: Props) {
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
        {meal.items.flatMap((item) => {
          return (
            <Box key={item.id}>
              <Text fontSize="sm" as="b">
                {item.title}
              </Text>
              <Text whiteSpace="pre-wrap" fontSize="xs" color="blackAlpha.700">
                {item.description}
              </Text>
              <RadioGroup>
                <VStack alignItems="start" spacing={0}>
                  {item.options.map((option) => {
                    return (
                      <Radio key={option.id} value={option.id}>
                        <Text fontSize="xs" as="span" color="blackAlpha.700">
                          {option.title}
                        </Text>
                        <Text fontSize="xs" as="span" color="blackAlpha.500" ml={1}>
                          +¥{option.extraPrice.toLocaleString("ja-JP")}
                        </Text>
                      </Radio>
                    );
                  })}
                </VStack>
              </RadioGroup>
            </Box>
          );
        })}
      </VStack>
    </VStack>
  );
}
