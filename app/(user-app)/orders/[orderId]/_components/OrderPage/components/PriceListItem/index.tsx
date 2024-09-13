"use client";

import { MealDetailModal } from "@/app/(user-app)/_components/RestaurantHalfModalBody/components/MealDetailModal";
import { Box, Button, Flex, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

type Props = {
  meal: Prisma.MealGetPayload<{
    select: {
      id: true;
      title: true;
      description: true;
      imagePath: true;
      price: true;
      listPrice: true;
      items: true;
    };
  }>;
};

export function PriceListItem({ meal }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box w="full">
        <Flex w="full">
          <Text>{meal.title}</Text>
          <Spacer />
          <Text fontWeight="bold" whiteSpace="nowrap">
            {meal.price.toLocaleString("ja-JP")} 円
          </Text>
        </Flex>
        <Button variant="outline" size="xs" onClick={onOpen}>
          セット詳細
        </Button>
      </Box>
      <MealDetailModal meal={meal} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
