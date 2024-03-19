"use client";

import { applyEarlyDiscount } from "@/utils/discount-price";
import { Button, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  meal: Meal;
};

export function MealPage({ meal }: Props) {
  const router = useRouter();
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
            <Heading size="sm">
              <Text
                as="span"
                fontSize="sm"
                fontWeight="normal"
                textDecoration="line-through"
                textDecorationColor="red.400"
                textDecorationThickness="2px"
                mr={1}
              >
                ¥{meal.price.toLocaleString("ja-JP")}
              </Text>
              ¥{applyEarlyDiscount(meal.price).toLocaleString("ja-JP")}
            </Heading>
          </VStack>
        </VStack>
      </VStack>
      <Button as={Link} href={`/restaurants/${meal.restaurantId}/meals/${meal.id}`} w="full" maxW="full" size="md">
        お店の詳細を見る
      </Button>
    </VStack>
  );
}
