"use client";

import { RestaurantWithDistance } from "../../../../types/RestaurantWithDistance";
import { Text } from "@chakra-ui/react";
import { useBusinessHourStatus } from "./_hooks/useBusinessHourStatus";

type Props = {
  openingHours: RestaurantWithDistance["openingHours"];
};

export function BusinessHourLabel({ openingHours }: Props) {
  const { businessHourStatus, nextOpeningTime, closingTime } = useBusinessHourStatus(openingHours);

  switch (businessHourStatus) {
    case "unknown":
      return null;
    case "open":
      return (
        <Text>
          <Text as="span" color="green">
            営業中
          </Text>
          {closingTime && `・営業終了: ${closingTime}`}
        </Text>
      );
    case "closed":
      return (
        <Text>
          <Text as="span" color="red">
            営業時間外
          </Text>
          {nextOpeningTime && `・営業開始: ${nextOpeningTime}`}
        </Text>
      );
    case "closing":
      return (
        <Text>
          <Text as="span" color="brown">
            まもなく閉店
          </Text>
          {closingTime && `・営業終了: ${closingTime}`}
        </Text>
      );
    case "opening":
      return (
        <Text>
          <Text as="span" color="brown">
            まもなく営業開始
          </Text>
          {nextOpeningTime && `・${nextOpeningTime}`}
        </Text>
      );
    default:
      return null;
  }
}
