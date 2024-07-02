import { MealPreviewBox } from "@/components/meal/MealPreviewBox";
import { HStack, Heading, Badge, VStack, Text, Icon, Box } from "@chakra-ui/react";
import NextLink from "next/link";
import { RestaurantWithDistance } from "../../_types/RestaurantWithDistance";
import { useMemo } from "react";
import { BusinessHourStatus } from "./_types/BusinessHourStatus";
import { FaMapMarkerAlt } from "react-icons/fa";

type Props = {
  restaurant: RestaurantWithDistance;
};

export function RestaurantListItem({ restaurant }: Props) {
  const currentOpeningHour = useMemo(() => {
    return restaurant.openingHours.find((openingHour) => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (openingHour.openHour < currentHour && currentHour < openingHour.closeHour) {
        return true;
      }

      if (openingHour.openHour === currentHour && openingHour.openMinute <= currentMinute) {
        return true;
      }

      if (openingHour.closeHour === currentHour && currentMinute <= openingHour.closeMinute) {
        return true;
      }

      return false;
    });
  }, [restaurant.openingHours]);

  const closingTime = useMemo(() => {
    return currentOpeningHour
      ? { hour: currentOpeningHour.closeHour, minute: currentOpeningHour.closeMinute }
      : undefined;
  }, [currentOpeningHour]);

  const nextOpeningTime = useMemo(() => {
    const nextOpeningHour = restaurant.openingHours.find((openingHour) => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (openingHour.openHour < currentHour && currentHour < openingHour.closeHour) {
        return false;
      }

      if (openingHour.openHour === currentHour && openingHour.openMinute <= currentMinute) {
        return false;
      }

      if (openingHour.closeHour === currentHour && currentMinute <= openingHour.closeMinute) {
        return false;
      }

      return true;
    });

    return nextOpeningHour ? { hour: nextOpeningHour.openHour, minute: nextOpeningHour.openMinute } : undefined;
  }, [restaurant.openingHours]);

  const businessHourStatus = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentOpeningHour) {
      if (closingTime) {
        if (closingTime.hour === currentHour && closingTime.minute - currentMinute <= 30) {
          return "closing";
        }
        if (closingTime.hour - currentHour === 1 && closingTime.minute + 60 - currentMinute <= 30) {
          return "closing";
        }
      }
      return "open";
    } else {
      if (nextOpeningTime) {
        if (nextOpeningTime.hour === currentHour && nextOpeningTime.minute - currentMinute <= 30) {
          return "opening";
        }
        if (nextOpeningTime.hour - currentHour === 1 && nextOpeningTime.minute + 60 - currentMinute <= 30) {
          return "opening";
        }
      }
      return "closed";
    }
  }, [closingTime, currentOpeningHour, nextOpeningTime]);

  return (
    <>
      <HStack px={4} overflowX="auto" className="hidden-scrollbar">
        {restaurant.meals.map((meal) => (
          <MealPreviewBox key={meal.id} meal={meal} href={`restaurants/${restaurant.id}?mealId=${meal.id}`} />
        ))}
      </HStack>
      <NextLink href={`/restaurants/${restaurant.id}`}>
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
            {businessHourStatus && (
              <BusinessHourLabel
                status={businessHourStatus}
                closingTime={closingTime}
                nextOpeningTime={nextOpeningTime}
              />
            )}
          </Box>
          {restaurant.isOpen ? (
            <>
              <Badge backgroundColor="brand.400" variant="solid" fontSize="sm">
                ○ 今すぐ入れます！
              </Badge>
            </>
          ) : (
            <Badge backgroundColor="blackAlpha.700" variant="solid" fontSize="sm">
              × 今は入れません
            </Badge>
          )}
        </VStack>
      </NextLink>
    </>
  );
}

function BusinessHourLabel({
  status,
  closingTime,
  nextOpeningTime
}: {
  status: BusinessHourStatus;
  closingTime?: { hour: number; minute: number };
  nextOpeningTime?: { hour: number; minute: number };
}) {
  switch (status) {
    case "unknown":
      return null;
    case "open":
      return (
        <Text>
          <Text as="span" color="green">
            営業中
          </Text>
          {closingTime &&
            `・営業終了: ${closingTime.hour}:${closingTime.minute.toString().padStart(2, "0")}${nextOpeningTime ? `・再開時間: ${nextOpeningTime.hour}:${nextOpeningTime.minute.toString().padStart(2, "0")}` : ""}`}
        </Text>
      );
    case "closed":
      return (
        <Text>
          <Text as="span" color="red">
            営業時間外
          </Text>
          {nextOpeningTime &&
            `・営業開始: ${nextOpeningTime.hour}:${nextOpeningTime.minute.toString().padStart(2, "0")}`}
        </Text>
      );
    case "closing":
      return (
        <Text>
          <Text as="span" color="brown">
            まもなく閉店
          </Text>
          {closingTime &&
            `・営業終了: ${closingTime.hour}:${closingTime.minute.toString().padStart(2, "0")}${nextOpeningTime ? `・再開時間: ${nextOpeningTime.hour}:${nextOpeningTime.minute.toString().padStart(2, "0")}` : ""}`}
        </Text>
      );
    case "opening":
      return (
        <Text>
          <Text as="span" color="brown">
            まもなく営業開始
          </Text>
          {nextOpeningTime &&
            `・${nextOpeningTime.hour.toString().padStart(2, "0")}:${nextOpeningTime.minute.toString().padStart(2, "0")}`}
        </Text>
      );
    default:
      return null;
  }
}
