"use client";

import { Heading, Box, HStack } from "@chakra-ui/react";
import { RestaurantWithDistance } from "../../_types/RestaurantWithDistance";
import { MealImages } from "../MealImages";
import { InteriorImage } from "../InteriorImage";
import { StatusBadge } from "./_components/StatusBadge";
import { getRestaurantStatus } from "@/utils/restaurant-status";
import { MouseEventHandler, useMemo } from "react";
import { BusinessHourLabel } from "./_components/BusinessHourLabel";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

type Props = {
  restaurant: RestaurantWithDistance;
  onClickHelp: () => void;
};

export function RestaurantListItem({ restaurant, onClickHelp }: Props) {
  const status = useMemo(
    () =>
      getRestaurantStatus({
        isOpen: restaurant.isOpen,
        isFull: restaurant.fullStatuses.some((status) => status.easedAt === null)
      }),
    [restaurant.fullStatuses, restaurant.isOpen]
  );
  const handleQuestionClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    onClickHelp();
  };
  return (
    <Box id={restaurant.id} gap={3} color={restaurant.isOpen ? "" : "gray"}>
      <Heading size="sm" mx={4}>
        {restaurant.name}
      </Heading>
      <Box fontSize="xs" mx={4}>
        <BusinessHourLabel openingHours={restaurant.openingHours} />
      </Box>
      <HStack px={4} overflowX="auto" className="hidden-scrollbar" alignItems="start" mt={1}>
        <MealImages restaurantId={restaurant.id} meals={restaurant.meals} status={status} />
        {restaurant.interiorImagePath && (
          <InteriorImage restaurantId={restaurant.id} interiorImagePath={restaurant.interiorImagePath} />
        )}
      </HStack>
      <HStack mx={4} mt={2}>
        <StatusBadge status={status} />
        <QuestionOutlineIcon color="gray" onClick={handleQuestionClick} />
      </HStack>
    </Box>
  );
}
