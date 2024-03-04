"use client";

import Map from "@/components/map";
import { useState } from "react";
import {
  Box,
  HStack,
  Heading,
  Text,
  Flex,
  Spacer,
  Badge,
  Center,
} from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { Prisma } from "@prisma/client";
import { MealPreviewBox } from "@/components/meal-preview";
import Link from "next/link";

export default function HomePage({
  restaurants,
}: {
  restaurants: Prisma.RestaurantGetPayload<{ include: { meals: true } }>[];
}) {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>();

  const handleRestaurantSelect = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    const element = document.getElementById(restaurantId);
    if (element) element.scrollIntoView();
  };

  return (
    <Flex h="full" w="full" direction="column" overflowY="hidden">
      <Box flex="1">
        <Map
          restaurants={restaurants}
          selectedRestaurantId={selectedRestaurantId}
          onRestaurantSelect={handleRestaurantSelect}
        />
      </Box>
      <Box
        maxHeight="70%"
        overflowY="auto"
        pb={4}
        className="hidden-scrollbar"
        backgroundColor="blackAlpha.100"
      >
        {restaurants.map((restaurant, index) => (
          <Box
            key={restaurant.id}
            id={restaurant.id}
            backgroundColor={restaurant.isOpen ? "white" : "transparent"}
            my={3}
            py={3}
          >
            <InView
              threshold={0.8}
              onChange={(inView) => {
                if (inView) {
                  setSelectedRestaurantId(restaurant.id);
                }
              }}
            >
              <Flex mx={4} alignItems="center">
                <Heading size="md">{restaurant.name}</Heading>
                <Spacer />
                {restaurant.isOpen ? (
                  <Badge colorScheme="green">営業中</Badge>
                ) : (
                  <Badge color="gray">準備中</Badge>
                )}
              </Flex>
              <HStack
                px={4}
                overflowX="auto"
                className="hidden-scrollbar"
                mt={3}
              >
                {restaurant.meals.map((meal) => (
                  <MealPreviewBox
                    key={meal.id}
                    meal={meal}
                    href={`/meals/${meal.id}`}
                  />
                ))}
                {restaurant.isOpen && (
                  <Center
                    maxW="200px"
                    minW="200px"
                    h="200px"
                    borderRadius={8}
                    borderWidth={2}
                    borderColor="orange.400"
                    as={Link}
                    href={`/restaurants/${restaurant.id}`}
                  >
                    <Text color="orange.400">お店の詳細を見る</Text>
                  </Center>
                )}
              </HStack>
            </InView>
            {index !== restaurants.length - 1 && (
              <Box w="full" h="0" backgroundColor="blackAlpha.100" />
            )}
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
