"use client";

import { Restaurant } from "@prisma/client";
import Map from "@/components/map";
import { useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import RestaurantDetail from "./restaurant-detail";
import { InView } from "react-intersection-observer";

export default function HomePage({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [selectedRestaurantID, setSelectedRestaurantID] = useState<number>();
  const [focusedRestaurantId, setFocusedRestaurantId] = useState<number>(
    restaurants[0].id
  );
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
      <HStack
        zIndex={10}
        position="fixed"
        left={0}
        bottom={0}
        overflowX="auto"
        scrollSnapType="x mandatory"
        marginBottom={6}
        spacing={4}
        className="hidden-scrollbar"
      >
        {restaurants.map((restaurant, index) => (
          <InView
            key={restaurant.id}
            as="div"
            threshold={1}
            onChange={(inView) => {
              if (inView) setFocusedRestaurantId(restaurant.id);
            }}
            style={{
              scrollSnapAlign: "center",
              scrollSnapStop: "always",
              minWidth: "70%",
              marginLeft: index === 0 ? "16px" : 0,
              marginRight: index === restaurants.length - 1 ? "16px" : 0,
            }}
          >
            <Card
              width="full"
              borderRadius="16px"
              boxShadow="2xl"
              onClick={() => setSelectedRestaurantID(restaurant.id)}
            >
              <CardHeader padding={0}>
                <Image
                  alt="商品"
                  borderTopRadius="16px"
                  src="https://tblg.k-img.com/resize/660x370c/restaurant/images/Rvw/108066/108066112.jpg?token=3e19a56&api=v2"
                />
              </CardHeader>
              <CardBody padding={3}>
                <Text as="b" fontSize="sm">
                  {restaurant.name}
                  <br />
                  <Text as="span" fontSize="md">
                    黄金のTKG
                  </Text>
                </Text>
              </CardBody>
            </Card>
          </InView>
        ))}
      </HStack>
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
