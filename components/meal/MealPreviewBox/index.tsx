"use client";

import { Box, BoxProps, Text } from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import { MealPreviewImage } from "../MealPreviewImage";
import { ReactNode } from "react";
import Link from "next/link";

type Props = {
  meal: Meal;
  href?: string;
  children?: ReactNode;
} & BoxProps;

export function MealPreviewBox({ meal, href, children, ...boxProps }: Props) {
  return (
    <Box
      maxW="150px"
      minW="150px"
      borderRadius={8}
      position="relative"
      {...boxProps}
      {...(href ? { as: Link, href: href } : {})}
    >
      <MealPreviewImage src={meal.imagePath} alt={`meal-${meal.id}`} />
      <Box position="absolute" top={0} left={0} m={2} borderRadius={4} backgroundColor="blackAlpha.700" px={2}>
        <Text color="white" noOfLines={1} fontSize="xs">
          {meal.title}
        </Text>
      </Box>
      <Box position="absolute" bottom={0} right={0} m={2} textAlign="center">
        <Text
          borderRadius={4}
          backgroundColor="blackAlpha.700"
          as="span"
          color="white"
          fontSize="xs"
          px={2}
          textAlign="center"
          fontWeight="bold"
        >
          ¥{meal.price.toLocaleString("ja-JP")}
        </Text>
      </Box>
      {children}
    </Box>
  );
}
