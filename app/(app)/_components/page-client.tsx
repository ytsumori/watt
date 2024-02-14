"use client";

import Map from "@/components/map";
import { useState } from "react";
import {
  Box,
  HStack,
  Heading,
  Image,
  Text,
  Flex,
  Spacer,
  Badge,
} from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { MealDetailModal } from "./meal-detail-modal";
import { MealPreviewImage } from "@/components/meal-preview-image";

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
              lat: 34.67938711932558,
              lng: 135.4989381822759,
            }}
          />
        </Box>
        <Box
          maxHeight="50%"
          overflowY="auto"
          py={4}
          className="hidden-scrollbar"
        >
          {restaurants.map((restaurant, index) => (
            <Box
              key={restaurant.id}
              id={restaurant.id}
              onClick={() => router.push(`/restaurants/${restaurant.id}`)}
            >
              <InView
                threshold={0.8}
                onChange={(inView) => {
                  if (inView) {
                    setSelectedRestaurantId(restaurant.id);
                  }
                }}
                style={{ marginBottom: "12px", marginTop: "12px" }}
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
                    <Box
                      maxW="200px"
                      minW="200px"
                      key={meal.id}
                      borderRadius={8}
                      position="relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMealId(meal.id);
                      }}
                    >
                      <MealPreviewImage
                        src={meal.imageUrl}
                        alt={`meal-${meal.id}`}
                      />
                      <Box
                        position="absolute"
                        bottom={0}
                        right={0}
                        m={2}
                        borderRadius={4}
                        backgroundColor="blackAlpha.700"
                        px={2}
                      >
                        <Text color="white">
                          ¥{meal.price.toLocaleString("ja-JP")}
                        </Text>
                      </Box>
                    </Box>
                  ))}
                </HStack>
              </InView>
              {index !== restaurants.length - 1 && (
                <Box w="full" h="8px" backgroundColor="blackAlpha.100" />
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
