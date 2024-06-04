"use client";

import { Box, Divider, Heading, Text, VStack } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

type Props = {
  meal: Prisma.MealGetPayload<{ include: { items: true } }>;
  isItemsHidden?: boolean;
};

export function MealInfo({ meal, isItemsHidden = false }: Props) {
  return (
    <VStack w="full" alignItems="start" spacing={2}>
      <Box w="full">
        <Heading size="md">{meal.title}</Heading>
        <Heading size="md">¥{meal.price.toLocaleString("ja-JP")}</Heading>
        <Text fontSize="sm" whiteSpace="pre-wrap" mt={2}>
          {meal.description}
        </Text>
      </Box>
      {!isItemsHidden && (
        <>
          <Divider borderColor="blackAlpha.400" />
          <Heading size="sm">セット内容</Heading>
          <VStack alignItems="start" spacing={1} w="full">
            {meal.items.map((item) => (
              <Box key={item.id}>
                <Text fontSize="sm" as="b">
                  {item.title}
                </Text>
                <Text whiteSpace="pre-wrap" fontSize="xs" color="blackAlpha.700">
                  {item.description}
                </Text>
              </Box>
            ))}
          </VStack>
        </>
      )}
    </VStack>
  );
}
