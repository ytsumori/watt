"use client";

import { Box, BoxProps, Text } from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import { MealPreviewImage } from "./meal-preview-image";
import { ReactNode } from "react";
import { applyEarlyDiscount } from "@/utils/discount-price";

type Props = {
  meal: Meal;
  onClick: () => void;
  children?: ReactNode;
} & BoxProps;

export function MealPreviewBox({
  meal,
  onClick,
  children,
  ...boxProps
}: Props) {
  return (
    <Box
      maxW="200px"
      minW="200px"
      key={meal.id}
      borderRadius={8}
      position="relative"
      onClick={onClick}
      {...boxProps}
    >
      <MealPreviewImage src={meal.imageUrl} alt={`meal-${meal.id}`} />
      <Box
        position="absolute"
        top={0}
        left={0}
        m={2}
        borderRadius={4}
        backgroundColor="blackAlpha.700"
        px={2}
      >
        <Text color="white" noOfLines={1}>
          {meal.title}
        </Text>
      </Box>
      <Box position="absolute" bottom={0} right={0} m={2} textAlign="center">
        <Box backgroundColor="red.400" borderRadius={4}>
          <Text color="white" fontWeight="bold" fontSize="md">
            ¥{applyEarlyDiscount(meal.price).toLocaleString("ja-JP")}
          </Text>
        </Box>
        <Text
          borderRadius={4}
          backgroundColor="blackAlpha.700"
          as="span"
          color="white"
          textDecoration="line-through"
          textDecorationColor="red.400"
          textDecorationThickness="2px"
          fontSize="sm"
          px={2}
          textAlign="center"
        >
          ¥{meal.price.toLocaleString("ja-JP")}
        </Text>
      </Box>
      {children}
    </Box>
  );
}
