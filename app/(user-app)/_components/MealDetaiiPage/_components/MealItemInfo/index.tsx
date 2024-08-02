"use client";

import { FC } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

type Props = {
  mealItem: Prisma.MealItemGetPayload<{ include: { options: true } }>;
};

export const MealItemInfo: FC<Props> = ({ mealItem }) => {
  return (
    <Box key={mealItem.id} w="full">
      <Text fontSize="sm" as="b">
        {mealItem.title}
      </Text>
      <Text whiteSpace="pre-wrap" fontSize="xs" color="blackAlpha.700">
        {mealItem.description}
      </Text>
      {mealItem.options.length > 0 && (
        <SimpleGrid columns={2} spacing={1} w="full">
          {mealItem.options.map((option) => {
            return (
              <Flex gap={2} key={option.id}>
                <Text fontSize="xs" color="blackAlpha.700">
                  {option.title}
                </Text>
                {option.extraPrice !== 0 ? (
                  <Text fontSize="xs" color="blackAlpha.500" ml={1}>
                    {option.extraPrice > 0 && "+"}
                    {option.extraPrice.toLocaleString("ja-JP")}円
                  </Text>
                ) : (
                  <Box h="18px" />
                )}
              </Flex>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};
