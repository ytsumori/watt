"use client";

import { Restaurant } from "@prisma/client";
import Map from "@/components/map";
import { useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Heading,
  Image,
  Slide,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import RestaurantDetail from "./restaurant-detail";

export default function HomePage({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [selectedRestaurantID, setSelectedRestaurantID] = useState<number>();
  const [focusedRestaurantId, setFocusedRestaurantId] = useState<number>();
  const handleRestaurantSelect = (id: number) => {
    setFocusedRestaurantId(id);
  };

  return (
    <Box height="100vh" width="100vw">
      <Map
        restaurants={restaurants}
        selectedRestaurantID={focusedRestaurantId}
        onRestaurantSelect={handleRestaurantSelect}
        defaultCenter={{
          lat: 34.67938711932558,
          lng: 135.4989381822759,
        }}
      />
      <Slide direction="bottom" in={!!focusedRestaurantId}>
        <VStack px={6} py={4} borderTopRadius={16} bgColor="white" spacing={4}>
          <HStack width="full">
            <Heading size="md">
              {
                restaurants.find(
                  (restaurant) => restaurant.id === focusedRestaurantId
                )?.name
              }
            </Heading>
            <Spacer />
            <CloseButton onClick={() => setFocusedRestaurantId(undefined)} />
          </HStack>
          <VStack width="full" spacing={2} alignItems="baseline">
            <Image
              alt="商品"
              src="https://tblg.k-img.com/resize/660x370c/restaurant/images/Rvw/108066/108066112.jpg?token=3e19a56&api=v2"
              width="full"
            />
            <Text as="b" fontSize="lg">
              黄金のTKG
              <br />
              <Text as="span" fontSize="2xl">
                <Text as="span" fontSize="xl">
                  ¥{" "}
                </Text>
                1,000
              </Text>
            </Text>
          </VStack>
          <Button
            colorScheme="teal"
            onClick={() => setSelectedRestaurantID(focusedRestaurantId)}
          >
            詳細を見る
          </Button>
        </VStack>
      </Slide>
      <Drawer
        isOpen={!!selectedRestaurantID}
        placement="bottom"
        onClose={() => setSelectedRestaurantID(undefined)}
      >
        <DrawerOverlay />
        <DrawerContent pb={3} borderTopRadius={16}>
          <DrawerCloseButton />
          <DrawerHeader>お店詳細</DrawerHeader>

          <DrawerBody p={0}>
            <RestaurantDetail />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
