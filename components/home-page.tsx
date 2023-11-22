"use client";

import { Restaurant } from "@prisma/client";
import Map from "@/components/map";
import { useState } from "react";
import {
  Button,
  CloseButton,
  HStack,
  Heading,
  Image,
  Slide,
  Spacer,
  VStack,
} from "@chakra-ui/react";

export default function HomePage({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [selectedRestaurantID, setSelectedRestaurantID] = useState<number>();
  const handleRestaurantSelect = (id: number) => {
    setSelectedRestaurantID(id);
  };

  return (
    <div className="h-screen w-screen">
      <Map
        restaurants={restaurants}
        selectedRestaurantID={selectedRestaurantID}
        onRestaurantSelect={handleRestaurantSelect}
      />
      <Slide
        direction="bottom"
        in={!!selectedRestaurantID}
        style={{ zIndex: 10 }}
      >
        <VStack bg="white" padding={4} borderTopRadius={16}>
          <HStack className="w-full">
            <Heading size="sm">
              {
                restaurants.find(
                  (restaurant) => restaurant.id === selectedRestaurantID
                )?.name
              }
            </Heading>
            <Spacer />
            <CloseButton onClick={() => setSelectedRestaurantID(undefined)} />
          </HStack>
          <Image
            alt="商品"
            src="https://tblg.k-img.com/resize/660x370c/restaurant/images/Rvw/108066/108066112.jpg?token=3e19a56&api=v2"
          />
          <Button variant="outline" colorScheme="teal">
            予約する
          </Button>
        </VStack>
      </Slide>
    </div>
  );
}
