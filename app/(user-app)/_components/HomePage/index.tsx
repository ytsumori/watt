"use client";

import Map from "@/components/map";
import { useEffect, useState } from "react";
import { Box, HStack, Heading, Badge, VStack, Text, Skeleton, Icon } from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { Prisma } from "@prisma/client";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { calculateDistance } from "../../_util/calculateDistance";
import { FaMapMarkerAlt } from "react-icons/fa";

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
      <Box h="300px" overflowY="auto" pb={4} className="hidden-scrollbar" backgroundColor="blackAlpha.100">
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
              threshold={0.8}
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
                  <MealPreviewBox key={meal.id} meal={meal} href={`restaurants/${restaurant.id}?mealId=${meal.id}`} />
                ))}
              </HStack>
              <NextLink href={`/restaurants/${restaurant.id}`}>
                <VStack px={4} alignItems="start" pt={4}>
                  <Heading size="sm" color={restaurant.isOpen ? "black" : "gray"}>
                    {restaurant.name}
                  </Heading>
                  {isGrantGeolocation && (
                    <>
                      {currentPosition?.coords.latitude && currentPosition?.coords.longitude ? (
                        <>
                          {restaurant.googleMapPlaceInfo?.latitude && restaurant.googleMapPlaceInfo?.longitude && (
                            <Text fontSize="xs" opacity={0.6}>
                              <Icon as={FaMapMarkerAlt} mr={1} />
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
                            </Text>
                          )}
                        </>
                      ) : (
                        <Skeleton height="12px" w="50%" />
                      )}
                    </>
                  )}
                  {restaurant.isOpen ? (
                    <Badge backgroundColor="brand.400" variant="solid" fontSize="sm">
                      ○ 今すぐ入れます！
                    </Badge>
                  ) : (
                    <Badge backgroundColor="blackAlpha.700" variant="solid" fontSize="sm">
                      × 今は入れません
                    </Badge>
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
