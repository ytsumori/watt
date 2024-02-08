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
import { Prisma } from "@prisma/client";

export default function HomePage({
  meals,
}: {
  meals: Prisma.MealGetPayload<{ include: { restaurant: true } }>[];
}) {
  const router = useRouter();
  const [focusedMealId, setFocusedMealId] = useState(
    meals.length > 0 ? meals[0].id : undefined
  );
  const handleRestaurantSelect = (id: string) => {
    setFocusedMealId(id);
  };

  return (
    <Box height="100vh" width="100vw">
      <Map
        restaurants={meals.flatMap((meal, index, self) =>
          index === self.findIndex((m) => meal.restaurantId === m.restaurantId)
            ? meal.restaurant
            : []
        )}
        selectedRestaurantId={
          meals.find((meal) => meal.id === focusedMealId)?.restaurantId
        }
        onRestaurantSelect={handleRestaurantSelect}
        defaultCenter={{
          lat: 34.67938711932558,
          lng: 135.4989381822759,
        }}
      />
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
        width="auto"
        className="hidden-scrollbar"
      >
        {meals.map((meal, index) => (
          <InView
            key={meal.id}
            as="div"
            threshold={1}
            onChange={(inView) => {
              if (inView) setFocusedMealId(meal.id);
            }}
            style={{
              scrollSnapAlign: "center",
              scrollSnapStop: "always",
              minWidth: "70%",
              marginLeft: index === 0 ? "1.5rem" : 0,
              marginRight: index === meals.length - 1 ? "1.5rem" : 0,
            }}
          >
            <Card
              marginY={2}
              width="full"
              borderRadius="16px"
              boxShadow="md"
              onClick={() =>
                router.push(
                  `/restaurants/${meal.restaurant.id}/meals/${meal.id}`
                )
              }
            >
              <CardHeader padding={0}>
                <Image
                  alt="商品"
                  borderTopRadius="16px"
                  src={meal.imageUrl}
                  aspectRatio="16/9"
                  fit="contain"
                />
              </CardHeader>
              <CardBody padding={3}>
                <Text as="b" fontSize="lg">
                  {meal.restaurant.name}
                </Text>
                <br />
                <Text as="b" fontSize="md">
                  {meal.price}円(税込)
                </Text>
              </CardBody>
            </Card>
          </InView>
        ))}
      </HStack>
    </Box>
  );
}
