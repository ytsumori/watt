"use client";

import { Heading, Box, HStack, IconButton } from "@chakra-ui/react";
import { RestaurantWithDistance } from "../../types/RestaurantWithDistance";
import { MealImages } from "../MealImages";
import { InteriorImage } from "../InteriorImage";
import { BusinessHourLabel } from "./_components/BusinessHourLabel";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { getNextOpeningHour, isCurrentlyWorkingHour, mergeOpeningHours } from "@/utils/opening-hours";
import { StatusBadge } from "@/app/(user-app)/_components/StatusBadge";
import { useQueryString } from "@/app/_hooks/useQueryString";

type Props = {
  restaurant: RestaurantWithDistance;
  onClickHelp: () => void;
};

export function RestaurantListItem({ restaurant, onClickHelp }: Props) {
  const { addQueryStringToCurrentPath } = useQueryString();
  const currentOpeningHours = mergeOpeningHours({
    regularOpeningHours: restaurant.openingHours,
    holidays: restaurant.holidays
  });

  const nextOpeningHour = getNextOpeningHour(currentOpeningHours);

  return (
    <Box
      id={restaurant.id}
      gap={3}
      backgroundColor="white"
      py={3}
      onClick={() => addQueryStringToCurrentPath("selectedRestaurantId", restaurant.id)}
    >
      <Heading size="sm" mx={4}>
        {restaurant.name}
      </Heading>
      <Box fontSize="xs" mx={4}>
        <BusinessHourLabel openingHours={currentOpeningHours} />
      </Box>
      <HStack px={4} overflowX="auto" className="hidden-scrollbar" alignItems="start" mt={1}>
        <MealImages meals={restaurant.meals} />
        {restaurant.interiorImagePath && (
          <InteriorImage restaurantId={restaurant.id} interiorImagePath={restaurant.interiorImagePath} />
        )}
      </HStack>
      <HStack mx={4} mt={2}>
        <StatusBadge
          isAvailable={restaurant.isAvailable}
          isWorkingHour={isCurrentlyWorkingHour(currentOpeningHours)}
          nextOpenAt={
            nextOpeningHour
              ? `${nextOpeningHour.hour}:${nextOpeningHour.minute.toString().padStart(2, "0")}`
              : undefined
          }
        />
        <IconButton
          aria-label="help"
          icon={<QuestionOutlineIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onClickHelp();
          }}
          variant="ghost"
          colorScheme="gray"
          minW={5}
          height={5}
        />
      </HStack>
    </Box>
  );
}
