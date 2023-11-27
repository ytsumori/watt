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
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import RestaurantDetail from "./restaurant-detail";
import { InView } from "react-intersection-observer";
import { Search2Icon } from "@chakra-ui/icons";
import { FaLocationCrosshairs, FaMap, FaQrcode, FaUser } from "react-icons/fa6";

export default function HomePage({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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
      <InputGroup position="fixed" top={0} left={0} zIndex={10}>
        <InputLeftElement pointerEvents="none" marginLeft={4} marginTop={4}>
          <Search2Icon color="cyan.400" />
        </InputLeftElement>
        <Input
          _placeholder={{ color: "cyan.400" }}
          borderWidth={0}
          placeholder="場所やキーワードで検索"
          backgroundColor="white"
          marginX={4}
          marginTop={4}
        />
      </InputGroup>
      <IconButton
        aria-label="current-location"
        icon={<FaLocationCrosshairs />}
        textColor="cyan.400"
        variant="ghost"
        zIndex={10}
        position="fixed"
        boxShadow="md"
        bottom="20rem"
        right={4}
        backgroundColor="white"
      />
      <HStack
        zIndex={10}
        position="fixed"
        left={0}
        bottom="3.5rem"
        overflowX="auto"
        scrollSnapType="x mandatory"
        marginBottom={4}
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
              marginLeft: index === 0 ? "1.5rem" : 0,
              marginRight: index === restaurants.length - 1 ? "1.5rem" : 0,
            }}
          >
            <Card
              marginY={2}
              width="full"
              borderRadius="16px"
              boxShadow="md"
              onClick={() => setIsDetailOpen(true)}
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
      <HStack
        backgroundColor="white"
        height="3.5rem"
        width="full"
        position="fixed"
        bottom={0}
        justifyContent="space-evenly"
      >
        <VStack spacing={0}>
          <IconButton
            aria-label="map"
            textColor="cyan.400"
            variant="ghost"
            icon={<FaMap />}
          />
        </VStack>
        <IconButton
          aria-label="check-in"
          textColor="cyan.400"
          colorScheme="cyan"
          variant="ghost"
          icon={<FaQrcode />}
        />
        <IconButton
          aria-label="home"
          textColor="cyan.400"
          colorScheme="cyan"
          variant="ghost"
          icon={<FaUser />}
        />
      </HStack>
      <Drawer
        isOpen={isDetailOpen}
        placement="bottom"
        onClose={() => setIsDetailOpen(false)}
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
