"use client";

import { Box, BoxProps, Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { MealPreviewImage } from "../MealPreviewImage";
import { ReactNode } from "react";
import Link from "next/link";

type Props = {
  meal: Prisma.MealGetPayload<{
    select: {
      id: true;
      title: true;
      price: true;
      imagePath: true;
    };
  }>;
  href?: string;
  children?: ReactNode;
  isLabelHidden?: boolean;
} & BoxProps;

export function MealPreviewBox({ meal, href, children, isLabelHidden = false, ...boxProps }: Props) {
  return (
    <Box
      maxW="150px"
      minW="150px"
      borderRadius={12}
      position="relative"
      {...boxProps}
      {...(href ? { as: Link, href: href } : {})}
    >
      <MealPreviewImage src={meal.imagePath} alt={`meal-${meal.id}`} />
      {!isLabelHidden && (
        <>
          <Box
            position="absolute"
            bottom={0}
            left={0}
            p={2}
            textAlign="start"
            backgroundColor="blackAlpha.700"
            color="white"
            fontSize="xs"
            lineHeight="12px"
            fontWeight="bold"
            w="full"
            borderBottomRadius={8}
          >
            <Text noOfLines={1}>{meal.title}</Text>
            <Text>¥{meal.price.toLocaleString("ja-JP")}</Text>
          </Box>
        </>
      )}
      {children}
    </Box>
  );
}
