"use client";

import { MealPreviewImage } from "@/components/MealPreviewImage";
import { Card, CardBody, CardFooter, Heading, Text, VStack } from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import { ReactNode } from "react";

type Props = {
  meal: Meal;
  button: ReactNode;
};

export function MealCard({ meal, button }: Props) {
  return (
    <Card variant="outline" maxW="300px">
      <MealPreviewImage src={meal.imageUrl} alt={meal.id} />
      <VStack spacing={0}>
        <CardBody>
          <VStack alignItems="start">
            <Heading size="md">{meal.title}</Heading>
            <Text size="sm">
              <Text as="b" mr={2}>
                金額:
              </Text>
              ¥{meal.price.toLocaleString("ja-JP")}
            </Text>
            <Text size="sm" whiteSpace="pre-wrap" border="1px" p={2}>
              {meal.description}
            </Text>
          </VStack>
        </CardBody>
        <CardFooter>{button}</CardFooter>
      </VStack>
    </Card>
  );
}
