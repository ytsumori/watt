"use client";

import Map from "@/components/Map";
import {
  Box,
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
import { RestaurantWithDistance } from "./_types/RestaurantWithDistance";
import { RestaurantListItem } from "./_components/RestaurantListItem";
import { useRouter } from "next-nprogress-bar";
import { useGetCurrentPosition } from "./hooks/useGetCurrentPosition";
import { useFetchNearbyRestaurants } from "./hooks/useFetchNearbyRestaurants";
import { useState } from "react";
import { getRestaurantStatus } from "@/utils/restaurant-status";
import { StatusBadge } from "./_components/RestaurantListItem/_components/StatusBadge";

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
              status: getRestaurantStatus({
                isOpen: restaurant.isOpen,
                isFull: restaurant.fullStatuses.some((status) => status.easedAt === null)
              })
            };
          })}
          currentLocation={position}
          activeRestaurant={
            activeRestaurant?.googleMapPlaceInfo
              ? {
                  id: activeRestaurant?.id ?? "",
                  name: activeRestaurant?.name ?? "",
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
            onChange={(inView, entry) => {
              const entryNode = entry.target.childNodes[0] as HTMLElement;
              if (isScrolling && entryNode.id === `restaurant-container-${activeRestaurant?.id}`) {
                setIsScrolling(false);
              }
              if (inView) {
                router.prefetch(`/restaurants/${restaurant.id}`);
                if (!isScrolling) setActiveRestaurant(restaurant);
              }
            }}
            style={{ width: "100%" }}
          >
            <Box
              id={`restaurant-container-${restaurant.id}`}
              backgroundColor={restaurant.isOpen ? "white" : "transparent"}
              py={3}
              onClick={() => router.push(`/restaurants/${restaurant.id}`)}
            >
              <RestaurantListItem restaurant={restaurant} onClickHelp={onHelpModalOpen} />
            </Box>
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
                <StatusBadge status="open" />
                <Text>お店に入れる状態です。割引を適用した価格でセットメニューをご提供します。</Text>
              </Box>
              <Box>
                <StatusBadge status="full" />
                <Text>
                  お店に入れる状態ですが、席が埋まってしまう可能性があります。定価でセットメニューをご提供します。
                </Text>
              </Box>
              <Box>
                <StatusBadge status="close" />
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
