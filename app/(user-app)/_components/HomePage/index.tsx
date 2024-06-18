"use client";

import Map from "@/components/map";
import { useEffect, useState } from "react";
import { Box, HStack, Heading, Badge, VStack } from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { Prisma } from "@prisma/client";
import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { calculateDistance } from "../../_util/calculateDistance";
import { findNearbyRestaurants } from "./_actions/findNearByRestaurants";
import { Distance } from "../Distance";
import { logger } from "@/utils/logger";

type NearbyRestaurant = Awaited<ReturnType<typeof findNearbyRestaurants>>;
type Restaurant = Prisma.RestaurantGetPayload<{
  include: { meals: true; googleMapPlaceInfo: { select: { latitude: true; longitude: true } } };
}>;

export default function HomePage({ restaurants }: { restaurants: Restaurant[] }) {
  const router = useRouter();
  const [inViewRestaurantIds, setInViewRestaurantIds] = useState<string[]>([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<NearbyRestaurant | (Restaurant & { distance?: string })[]>(
    restaurants
  );

  useEffect(() => {
    navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude: lat, longitude: long } = position.coords;
        if (permissionStatus.state === "granted") {
          try {
            const sortedRestaurants = await findNearbyRestaurants({ long, lat, restaurants });
            setNearbyRestaurants(sortedRestaurants);
          } catch (error) {
            setNearbyRestaurants(
              restaurants.map((restaurant) => ({
                ...restaurant,
                distance: calculateDistance({
                  origin: { lat, lng: long },
                  destination: {
                    lat: restaurant.googleMapPlaceInfo?.latitude,
                    lng: restaurant.googleMapPlaceInfo?.longitude
                  }
                })
              }))
            );
            logger({
              severity: "ERROR",
              message: "findNearbyRestaurantsの呼び出しに失敗しました",
              payload: { error: JSON.stringify(error) }
            });
          }
        }
      });
    });
  }, [restaurants]);

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
      <Box minH="280px" h="50%" overflowY="auto" pb={4} className="hidden-scrollbar" backgroundColor="blackAlpha.100">
        {nearbyRestaurants.map((restaurant, index) => (
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
                <VStack px={4} alignItems="start" pt={3} spacing={1}>
                  <Heading size="sm" color={restaurant.isOpen ? "black" : "gray"}>
                    {restaurant.name}
                  </Heading>
                  {restaurant.distance ? <Distance distance={restaurant.distance} /> : <></>}
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
