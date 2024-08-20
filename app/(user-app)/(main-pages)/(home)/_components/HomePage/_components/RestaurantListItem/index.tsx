"use client";

import { Heading, Box, HStack } from "@chakra-ui/react";
import { RestaurantWithDistance } from "../../_types/RestaurantWithDistance";
import { MealImages } from "../MealImages";
import { InteriorImage } from "../InteriorImage";
import { StatusBadge } from "../../../../../_components/StatusBadge";
import { MouseEventHandler } from "react";
import { BusinessHourLabel } from "./_components/BusinessHourLabel";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { getNextOpeningHour, isCurrentlyWorkingHour } from "@/utils/opening-hours";

type Props = {
  restaurant: RestaurantWithDistance;
  onClickHelp: () => void;
};

export function RestaurantListItem({ restaurant, onClickHelp }: Props) {
  const nextOpeningHour = getNextOpeningHour(restaurant.openingHours);
  const handleQuestionClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    onClickHelp();
  };
  return (
    <Box id={restaurant.id} gap={3}>
      <Heading size="sm" mx={4}>
        {restaurant.name}
      </Heading>
      <Box fontSize="xs" mx={4}>
        <BusinessHourLabel openingHours={restaurant.openingHours} />
      </Box>
      <HStack px={4} overflowX="auto" className="hidden-scrollbar" alignItems="start" mt={1}>
        <MealImages meals={restaurant.meals} status={restaurant.status} />
        {restaurant.interiorImagePath && (
          <InteriorImage restaurantId={restaurant.id} interiorImagePath={restaurant.interiorImagePath} />
        )}
      </HStack>
      <HStack mx={4} mt={2}>
        <StatusBadge
          status={restaurant.status}
          isWorkingHour={isCurrentlyWorkingHour(restaurant.openingHours)}
          nextOpenAt={
            nextOpeningHour
              ? `${nextOpeningHour.hour}:${nextOpeningHour.minute.toString().padStart(2, "0")}`
              : undefined
          }
        />
        <QuestionOutlineIcon color="gray" onClick={handleQuestionClick} />
      </HStack>
    </Box>
  );
}
