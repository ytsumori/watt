"use client";

import { applyEarlyDiscount } from "@/utils/discount-price";
import { Box, Button, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import Link from "next/link";

type Props = {
  meal: Meal;
};

export function MealPage({ meal }: Props) {
  return (
    <VStack p={4} spacing={4} alignItems="start">
      <VStack alignItems="start" spacing={4}>
        <Heading size="lg">{meal.title}</Heading>
        <VStack alignItems="start" spacing={4}>
          <VStack w="full" alignItems="start" spacing={2}>
            <Image src={meal.imageUrl} alt={meal.title} />
            <Text fontSize="sm" whiteSpace="pre-wrap">
              {meal.description}
            </Text>
          </VStack>
          <VStack spacing={2} alignItems="start">
            <Heading size="md">金額</Heading>
            <HStack>
              <Text
                as="span"
                fontSize="sm"
                fontWeight="normal"
                textDecoration="line-through"
                textDecorationColor="red.400"
                textDecorationThickness="2px"
              >
                ¥{meal.price.toLocaleString("ja-JP")}
              </Text>
              <HStack spacing={1}>
                <Heading color="red.400" size="sm">
                  ¥{applyEarlyDiscount(meal.price).toLocaleString("ja-JP")}
                </Heading>
                <Box backgroundColor="red.400" borderRadius={4}>
                  <Text color="white" fontWeight="bold" fontSize="xs" px={2}>
                    早期割引
                  </Text>
                </Box>
              </HStack>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
      <Button as={Link} href={`/restaurants/${meal.restaurantId}/meals/${meal.id}`} w="full" maxW="full" size="md">
        お店の詳細を見る
      </Button>
    </VStack>
  );
}
