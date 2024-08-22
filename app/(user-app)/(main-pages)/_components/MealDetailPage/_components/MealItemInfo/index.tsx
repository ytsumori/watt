"use client";

import { FC } from "react";
import { Box, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
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
        <UnorderedList>
          {mealItem.options.map((option) => {
            return (
              <ListItem key={option.id} fontSize="xs" color="blackAlpha.700" justifyContent="space-between">
                <Flex justifyContent="space-between">
                  <Text ml={1}>{option.title}</Text>
                  {option.extraPrice !== 0 && (
                    <Text color="blackAlpha.500">
                      {option.extraPrice > 0 && "+"}
                      {option.extraPrice.toLocaleString("ja-JP")}円
                    </Text>
                  )}
                </Flex>
              </ListItem>
            );
          })}
        </UnorderedList>
      )}
    </Box>
  );
};
