"use client";

import Map from "@/components/map";
import { useEffect, useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { calculateDistance } from "../../_util/calculateDistance";
import { findNearbyRestaurants } from "./_actions/findNearByRestaurants";
import { logger } from "@/utils/logger";
import { RestaurantWithDistance } from "./_types/RestaurantWithDistance";
import { RestaurantListItem } from "./_components/RestaurantListItem";
import { useRouter } from "next-nprogress-bar";

export default function HomePage({ restaurants }: { restaurants: RestaurantWithDistance[] }) {
  const router = useRouter();
  const [inViewRestaurantIds, setInViewRestaurantIds] = useState<string[]>([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState(restaurants);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude: lat, longitude: long } = position.coords;
      if (lat && long) {
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
      <VStack
        w="full"
        minH="280px"
        h="50%"
        overflowY="auto"
        pt={3}
        pb={4}
        className="hidden-scrollbar"
        backgroundColor="blackAlpha.100"
        spacing={3}
        alignItems="start"
      >
        {nearbyRestaurants.map((restaurant, index) => (
          <InView
            key={restaurant.id}
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
            style={{ width: "100%" }}
          >
            <Box
              backgroundColor={restaurant.isOpen ? "white" : "transparent"}
              py={3}
              onClick={() => router.push(`/restaurants/${restaurant.id}`)}
            >
              <RestaurantListItem restaurant={restaurant} />
            </Box>
          </InView>
        ))}
      </VStack>
    </>
  );
}
