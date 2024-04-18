"use client";

import Map from "@/components/map";
import { useState } from "react";
import { Box, HStack, Heading, Text, Flex, Badge, Center } from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { Prisma } from "@prisma/client";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import NextLink from "next/link";

export default function HomePage({
  restaurants
}: {
  restaurants: Prisma.RestaurantGetPayload<{
    include: { meals: true; googleMapPlaceInfo: { select: { latitude: true; longitude: true } } };
  }>[];
}) {
  const [inViewRestaurantIds, setInViewRestaurantIds] = useState<string[]>([]);

  const handleRestaurantSelect = (restaurantId: string) => {
    const element = document.getElementById(restaurantId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Flex h="100vh" w="100vw" direction="column" overflowY="hidden">
      <Box flex="1">
        <Map
          restaurants={restaurants.flatMap((restaurant) => {
            if (!restaurant.googleMapPlaceInfo) return [];

            return {
              id: restaurant.id,
              name: restaurant.name,
              location: {
                lat: restaurant.googleMapPlaceInfo.latitude,
                lng: restaurant.googleMapPlaceInfo.longitude
              }
            };
          })}
          activeRestaurantIds={inViewRestaurantIds}
          availableRestaurantIds={restaurants.flatMap((restaurant) => (restaurant.isOpen ? [restaurant.id] : []))}
          onRestaurantSelect={handleRestaurantSelect}
        />
      </Box>
      <Box maxHeight="70%" overflowY="auto" pb={4} className="hidden-scrollbar" backgroundColor="blackAlpha.100">
        {restaurants.map((restaurant, index) => (
          <Box
            key={restaurant.id}
            id={restaurant.id}
            backgroundColor={restaurant.isOpen ? "white" : "transparent"}
            my={3}
            py={3}
          >
            <InView
              initialInView={index < 2}
              threshold={0}
              onChange={(inView) => {
                if (inView) {
                  setInViewRestaurantIds((prev) => [...prev, restaurant.id]);
                } else {
                  setInViewRestaurantIds((prev) => prev.filter((id) => id !== restaurant.id));
                }
              }}
            >
              <Flex mx={4} alignItems="center">
                <Heading
                  color={restaurant.isOpen ? "black" : "gray"}
                  as={NextLink}
                  href={`/restaurants/${restaurant.id}`}
                >
                  {restaurant.name}
                </Heading>
                {restaurant.isOpen ? (
                  <Badge colorScheme="green" variant="solid" ml={2}>
                    今すぐ入れます！
                  </Badge>
                ) : (
                  <Badge colorScheme="red" variant="solid" ml={2}>
                    今は入れません
                  </Badge>
                )}
              </Flex>
              <HStack px={4} overflowX="auto" className="hidden-scrollbar" mt={3}>
                {restaurant.meals.map((meal) => (
                  <MealPreviewBox key={meal.id} meal={meal} href={`restaurants/${restaurant.id}/meals/${meal.id}`} />
                ))}
                {restaurant.isOpen && (
                  <Center
                    maxW="200px"
                    minW="200px"
                    h="200px"
                    borderRadius={8}
                    borderWidth={2}
                    borderColor="orange.400"
                    as={NextLink}
                    href={`/restaurants/${restaurant.id}`}
                  >
                    <Text color="orange.400">お店の詳細を見る</Text>
                  </Center>
                )}
              </HStack>
            </InView>
            {index !== restaurants.length - 1 && <Box w="full" h="0" backgroundColor="blackAlpha.100" />}
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
