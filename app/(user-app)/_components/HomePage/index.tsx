"use client";

import Map from "@/components/Map";
import { Box, VStack } from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { RestaurantWithDistance } from "./_types/RestaurantWithDistance";
import { RestaurantListItem } from "./_components/RestaurantListItem";
import { useRouter } from "next-nprogress-bar";
import { useGetCurrentPosition } from "./hooks/useGetCurrentPosition";
import { useFetchNearbyRestaurants } from "./hooks/useFetchNearbyRestaurants";
import { useState } from "react";

export default function HomePage({ restaurants }: { restaurants: RestaurantWithDistance[] }) {
  const router = useRouter();
  const { position } = useGetCurrentPosition();
  const { nearbyRestaurants } = useFetchNearbyRestaurants({ position, restaurants });
  const [activeRestaurant, setActiveRestaurant] = useState<RestaurantWithDistance | null>(null);

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
          currentLocation={position}
          activeRestaurant={{
            id: activeRestaurant?.id ?? "",
            name: activeRestaurant?.name ?? "",
            location: {
              lat: activeRestaurant?.googleMapPlaceInfo?.latitude,
              lng: activeRestaurant?.googleMapPlaceInfo?.longitude
            }
          }}
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
                setActiveRestaurant(restaurant);
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
