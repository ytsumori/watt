"use client";

import Map from "@/components/map";
import { useEffect, useState } from "react";
import { Box, HStack, Heading, Badge, VStack, Spinner, Flex, Text } from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { Prisma } from "@prisma/client";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { calculateDistance } from "../../_util/calculateDistance";

export default function HomePage({
  restaurants
}: {
  restaurants: Prisma.RestaurantGetPayload<{
    include: { meals: true; googleMapPlaceInfo: { select: { latitude: true; longitude: true } } };
  }>[];
}) {
  const router = useRouter();
  const [inViewRestaurantIds, setInViewRestaurantIds] = useState<string[]>([]);
  const [isGrantGeolocation, setIsGrantGeolocation] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => setIsGrantGeolocation("granted" === permissionStatus.state));
    navigator.geolocation.getCurrentPosition((position) => setCurrentPosition(position));
  }, []);

  const handleRestaurantSelect = (restaurantId: string) => {
    const element = document.getElementById(restaurantId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Box flex="1">
        <Map
          restaurants={restaurants.flatMap((restaurant) => {
            if (!restaurant.googleMapPlaceInfo) return [];

            return {
              id: restaurant.id,
              name: restaurant.name,
              location: { lat: restaurant.googleMapPlaceInfo.latitude, lng: restaurant.googleMapPlaceInfo.longitude }
            };
          })}
          activeRestaurantIds={inViewRestaurantIds}
          availableRestaurantIds={restaurants.flatMap((restaurant) => (restaurant.isOpen ? [restaurant.id] : []))}
          onRestaurantSelect={handleRestaurantSelect}
        />
      </Box>
      <Box h="320px" overflowY="auto" pb={4} className="hidden-scrollbar" backgroundColor="blackAlpha.100">
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
              threshold={1}
              onChange={(inView) => {
                if (inView) {
                  router.prefetch(`/restaurants/${restaurant.id}`);
                  setInViewRestaurantIds((prev) => [...prev, restaurant.id]);
                } else {
                  setInViewRestaurantIds((prev) => prev.filter((id) => id !== restaurant.id));
                }
              }}
            >
              <HStack px={4} overflowX="auto" className="hidden-scrollbar" mt={3}>
                {restaurant.meals.map((meal) => (
                  <MealPreviewBox key={meal.id} meal={meal} href={`restaurants/${restaurant.id}/meals/${meal.id}`} />
                ))}
              </HStack>
              <NextLink href={`/restaurants/${restaurant.id}`}>
                <VStack px={4} alignItems="start" pt={4}>
                  <Heading size="sm" color={restaurant.isOpen ? "black" : "gray"}>
                    {restaurant.name}
                  </Heading>
                  {restaurant.isOpen ? (
                    <Badge backgroundColor="orange.400" variant="solid">
                      ○ 今すぐ入れます！
                    </Badge>
                  ) : (
                    <Badge backgroundColor="blackAlpha.700" variant="solid">
                      × 今は入れません
                    </Badge>
                  )}
                  {isGrantGeolocation && (
                    <>
                      {currentPosition?.coords.latitude && currentPosition?.coords.longitude ? (
                        <>
                          {restaurant.googleMapPlaceInfo?.latitude && restaurant.googleMapPlaceInfo?.longitude && (
                            <Badge border="GrayText" variant="solid" textTransform="none">
                              現在地から
                              {calculateDistance({
                                origin: {
                                  lat: restaurant.googleMapPlaceInfo.latitude,
                                  lng: restaurant.googleMapPlaceInfo.longitude
                                },
                                destination: {
                                  lat: currentPosition.coords.latitude,
                                  lng: currentPosition.coords.longitude
                                }
                              })}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Flex>
                          <Spinner size="sm" alignItems="center" />
                          <Text fontSize="sm" ml={2} color="gray.500">
                            現在位置を取得中
                          </Text>
                        </Flex>
                      )}
                    </>
                  )}
                </VStack>
              </NextLink>
            </InView>
            {index !== restaurants.length - 1 && <Box w="full" h="0" backgroundColor="blackAlpha.100" />}
          </Box>
        ))}
      </Box>
    </>
  );
}
