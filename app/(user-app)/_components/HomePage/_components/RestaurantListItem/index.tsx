"use client";

import { Heading, Badge, VStack, Text, Icon, Box } from "@chakra-ui/react";
import { RestaurantWithDistance } from "../../_types/RestaurantWithDistance";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ImageStacks } from "../ImageStacks";
import { BusinessHourLabel } from "./_components/BusinessHourLabel";

type Props = {
  restaurant: RestaurantWithDistance;
};

export function RestaurantListItem({ restaurant }: Props) {
  return (
    <>
      <ImageStacks
        restaurantId={restaurant.id}
        meals={restaurant.meals}
        interiorImagePath={restaurant.interiorImagePath ?? undefined}
      />
      <VStack px={4} alignItems="start" pt={3} spacing={1}>
        <Heading size="sm" color={restaurant.isOpen ? "black" : "gray"}>
          {restaurant.name}
        </Heading>
        <Box fontSize="xs" opacity={0.6}>
          {restaurant.distance ? (
            <Text>
              <Icon as={FaMapMarkerAlt} mr={1} />
              現在地から
              {restaurant.distance}
            </Text>
          ) : (
            <></>
          )}
          <BusinessHourLabel openingHours={restaurant.openingHours} />
        </Box>
        {restaurant.isOpen ? (
          <Badge backgroundColor="brand.400" variant="solid" fontSize="sm">
            ○ 今すぐ入れます！
          </Badge>
        ) : (
          <Badge backgroundColor="blackAlpha.700" variant="solid" fontSize="sm">
            × 今は入れません
          </Badge>
        )}
      </VStack>
    </>
  );
}
