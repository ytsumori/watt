"use client";

import { Restaurant } from "@/constants/restaurants";
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
import Comments from "./comments";

export default function HomePage({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number>();
  const [focusedRestaurantId, setFocusedRestaurantId] = useState<number>(
    restaurants[0].id
  );
  const handleRestaurantSelect = (id: number) => {
    setFocusedRestaurantId(id);
  };
  const [isPurchased, setIsPurchased] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

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
              onClick={() => setSelectedRestaurantId(restaurant.id)}
            >
              <CardHeader padding={0}>
                <Image
                  alt="商品"
                  borderTopRadius="16px"
                  src={restaurant.foodImagePath}
                />
              </CardHeader>
              <CardBody padding={3}>
                <Text as="b" fontSize="lg">
                  {restaurant.name}
                </Text>
                <br />
                <Text as="b" fontSize="md">
                  {restaurant.price}円(税込)
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
        isOpen={!!selectedRestaurantId}
        placement="bottom"
        onClose={() =>
          isCommentOpen
            ? setIsCommentOpen(false)
            : setSelectedRestaurantId(undefined)
        }
      >
        <DrawerOverlay />
        <DrawerContent pb={3} borderTopRadius={16} height="full">
          <DrawerCloseButton />
          <DrawerHeader>{isCommentOpen ? "コメント" : "お店詳細"}</DrawerHeader>

          <DrawerBody p={0}>
            {isCommentOpen ? (
              <Comments />
            ) : (
              <RestaurantDetail
                isPurchased={isPurchased}
                selectedRestaurantId={selectedRestaurantId!}
                onPurchase={() => setIsPurchased(true)}
                onClickComment={() => setIsCommentOpen(true)}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
