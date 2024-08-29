"use client";

import Map from "@/components/Map";
import {
  Box,
  HStack,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { RestaurantWithDistance } from "./types/RestaurantWithDistance";
import { RestaurantListItem } from "./components/RestaurantListItem";
import { useRouter } from "next-nprogress-bar";
import { useGetCurrentPosition } from "./hooks/useGetCurrentPosition";
import { useFetchNearbyRestaurants } from "./hooks/useFetchNearbyRestaurants";
import { useState } from "react";
import { StatusBadge } from "../../../_components/StatusBadge";
import NextLink from "next/link";

export default function HomePage({ restaurants }: { restaurants: RestaurantWithDistance[] }) {
  const router = useRouter();
  const { position } = useGetCurrentPosition();
  const { nearbyRestaurants } = useFetchNearbyRestaurants({ position, restaurants });
  const [activeRestaurant, setActiveRestaurant] = useState<RestaurantWithDistance | null>(null);
  const { isOpen: isHelpModalOpen, onOpen: onHelpModalOpen, onClose: onHelpModalClose } = useDisclosure();
  const [isScrolling, setIsScrolling] = useState(false);

  const handleRestaurantSelect = (restaurantId: string) => {
    const element = document.getElementById(restaurantId);
    if (element) {
      setIsScrolling(true);
      const restaurant = nearbyRestaurants.find((r) => r.id === restaurantId);
      restaurant && setActiveRestaurant(restaurant);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Box flex="1">
        <Map
          restaurants={nearbyRestaurants.flatMap((restaurant) => {
            if (!restaurant.googleMapPlaceInfo) return [];
            return {
              id: restaurant.id,
              name: restaurant.name,
              location: { lat: restaurant.googleMapPlaceInfo.latitude, lng: restaurant.googleMapPlaceInfo.longitude },
              isAvailable: restaurant.isAvailable
            };
          })}
          currentLocation={position}
          activeRestaurant={
            activeRestaurant?.googleMapPlaceInfo
              ? {
                  id: activeRestaurant?.id ?? "",
                  name: activeRestaurant?.name ?? "",
                  isAvailable: activeRestaurant.isAvailable,
                  location: {
                    lat: activeRestaurant.googleMapPlaceInfo.latitude,
                    lng: activeRestaurant.googleMapPlaceInfo.longitude
                  }
                }
              : null
          }
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
              if (isScrolling && activeRestaurant && activeRestaurant.id === restaurant.id) setIsScrolling(false);
              if (inView) {
                router.prefetch(`/restaurants/${restaurant.id}`);
                if (!isScrolling) setActiveRestaurant(restaurant);
              }
            }}
            style={{ width: "100%" }}
          >
            <LinkBox id={restaurant.id} backgroundColor="white" py={3}>
              <LinkOverlay as={NextLink} href={`/restaurants/${restaurant.id}`} />
              <RestaurantListItem restaurant={restaurant} onClickHelp={onHelpModalOpen} />
            </LinkBox>
          </InView>
        ))}
      </VStack>
      <Modal isOpen={isHelpModalOpen} onClose={onHelpModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>お店のステータスについて</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={0} pb={4}>
            <VStack alignItems="start" fontSize="sm">
              <Text>お店の空き確認ステータスのいずれかに設定されています。</Text>
              <Box>
                <StatusBadge isAvailable isWorkingHour />
                <Text>Wattによるお店の空き状況の確認ができる状態です。</Text>
              </Box>
              <Box>
                <HStack>
                  <StatusBadge isAvailable={false} isWorkingHour />
                  <StatusBadge isAvailable={false} isWorkingHour={false} />
                </HStack>
                <Text>Wattによる店の空き状況の確認ができない状態です。</Text>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
