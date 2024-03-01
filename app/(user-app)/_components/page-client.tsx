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
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { MealDetailModal } from "./meal-detail-modal";
import { MealPreviewBox } from "@/components/meal-preview";

export default function HomePage({
  restaurants,
}: {
  restaurants: Prisma.RestaurantGetPayload<{ include: { meals: true } }>[];
}) {
  const router = useRouter();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>();
  const [selectedMealId, setSelectedMealId] = useState<string>();

  const handleRestaurantSelect = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    const element = document.getElementById(restaurantId);
    if (element) element.scrollIntoView();
  };

  const handleMealConfirm = (restaurantId: string) => {
    if (!selectedMealId) return;

    router.push(`restaurants/${restaurantId}/meals/${selectedMealId}`);
  };

  return (
    <>
      <Flex h="full" w="full" direction="column" overflowY="hidden">
        <Box flex="1">
          <Map
            restaurants={restaurants}
            selectedRestaurantId={selectedRestaurantId}
            onRestaurantSelect={handleRestaurantSelect}
            defaultCenter={{
              lat: 34.70726721576163,
              lng: 135.51175158248128,
            }}
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
                      onClick={() => {
                        setSelectedMealId(meal.id);
                      }}
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
                      onClick={() => {
                        router.push(`/restaurants/${restaurant.id}`);
                      }}
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
      <MealDetailModal
        mealId={selectedMealId ?? ""}
        isOpen={!!selectedMealId}
        completeButton={{
          label: "この推しメシの詳細を見る",
          onClick: handleMealConfirm,
        }}
        onClose={() => setSelectedMealId(undefined)}
      />
    </>
  );
}
