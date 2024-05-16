"use client";

import { MealPreviewImage } from "@/components/meal/MealPreviewImage";
import { Box, Card, CardBody, CardFooter, Heading, Text, VStack } from "@chakra-ui/react";
import { Meal } from "@prisma/client";
import { ReactNode } from "react";

type Props = {
  meal: Meal;
  button: ReactNode;
};

export function MealCard({ meal, button }: Props) {
  return (
    <Card variant="outline" maxW="250px">
      <MealPreviewImage src={meal.imagePath} alt={meal.id} />
      <VStack spacing={0}>
        <CardBody>
          <VStack alignItems="start">
            <Heading size="md">{meal.title}</Heading>
            <Box>
              {meal.listPrice && <Text fontSize="xs">定価：¥{meal.listPrice.toLocaleString("ja-JP")}</Text>}
              <Text fontSize="sm" as="b">
                金額：¥{meal.price.toLocaleString("ja-JP")}
              </Text>
            </Box>
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
