"use client";

import Map from "@/components/map";
import { useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { InView } from "react-intersection-observer";
import { Search2Icon } from "@chakra-ui/icons";
import { FaLocationCrosshairs, FaMap, FaQrcode, FaUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Restaurant } from "@prisma/client";

export default function HomePage({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const router = useRouter();
  const [focusedRestaurantId, setFocusedRestaurantId] = useState<string>(
    restaurants[0].id
  );
  const handleRestaurantSelect = (id: string) => {
    setFocusedRestaurantId(id);
  };

  return (
    <Box height="100vh" width="100vw">
      <Map
        restaurants={restaurants}
        selectedRestaurantId={focusedRestaurantId}
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
              onClick={() => router.push(`/restaurants/${restaurant.id}`)}
            >
              <CardHeader padding={0}>
                <Image
                  alt="商品"
                  borderTopRadius="16px"
                  src={restaurant.imageUrl}
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
          onClick={() => router.push("/login")}
        />
      </HStack>
    </Box>
  );
}
