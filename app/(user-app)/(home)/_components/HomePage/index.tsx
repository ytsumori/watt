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
              status: restaurant.status
            };
          })}
          currentLocation={position}
          activeRestaurant={
            activeRestaurant?.googleMapPlaceInfo
              ? {
                  id: activeRestaurant?.id ?? "",
                  name: activeRestaurant?.name ?? "",
                  status: activeRestaurant.status,
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
              <Box>
                <StatusBadge status="OPEN" isWorkingHour={true} />
                <Text>お店に入れる状態です。割引を適用した価格でセットメニューをご提供します。</Text>
              </Box>
              <Box>
                <StatusBadge status="PACKED" isWorkingHour={true} />
                <Text>
                  お店に入れる状態ですが、席が埋まってしまう可能性があります。定価でセットメニューをご提供します。
                </Text>
              </Box>
              <Box>
                <HStack>
                  <StatusBadge status="CLOSED" isWorkingHour />
                  <StatusBadge status="CLOSED" isWorkingHour={false} />
                </HStack>
                <Text>お店に入れない状態です。</Text>
              </Box>
              <Text fontSize="xs" color="gray.500">
                ※ステータスはリアルタイムではありません
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
