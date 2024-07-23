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
      listPrice: true;
      imagePath: true;
    };
  }>;
  href?: string;
  children?: ReactNode;
  isLabelHidden?: boolean;
  isDiscounted?: boolean;
  isRouter?: boolean;
} & BoxProps;

export function MealPreviewBox({
  meal,
  href,
  children,
  isLabelHidden = false,
  isDiscounted = false,
  isRouter = false,
  onClick,
  ...boxProps
}: Props) {
  return (
    <Box
      maxW="150px"
      minW="150px"
      borderRadius={12}
      {...(href ? { as: Link, href: href, onClick: (e) => e.stopPropagation() } : { onClick })}
    >
      <Box borderRadius={12} position="relative" {...boxProps}>
        <MealPreviewImage src={meal.imagePath} alt={`meal-${meal.id}`} />
        {children}
      </Box>
      {!isLabelHidden && (
        <>
          <Text noOfLines={1} fontSize="xs" mt={1} fontWeight="bold">
            {meal.title}
          </Text>
          <Box lineHeight="normal">
            {isDiscounted ? (
              <>
                <Text as="span" textDecorationLine="line-through" fontSize="xs">
                  ¥{meal.listPrice!.toLocaleString("ja-JP")}
                </Text>
                <Text as="span" fontSize="md" fontWeight="bold" color="brand.400" ml={1}>
                  ¥{meal.price.toLocaleString("ja-JP")}
                </Text>
              </>
            ) : (
              <Text as="span" fontSize="md" fontWeight="bold">
                ¥{meal.listPrice!.toLocaleString("ja-JP")}
              </Text>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
