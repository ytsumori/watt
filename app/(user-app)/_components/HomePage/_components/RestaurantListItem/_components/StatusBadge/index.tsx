import { Badge } from "@chakra-ui/react";
import { RestaurantStatus } from "@/utils/restaurant-status";

type Props = {
  status: RestaurantStatus;
};

export function StatusBadge({ status }: Props) {
  return (
    <Badge backgroundColor={getBackgroundColor(status)} variant={getVariant(status)} fontSize="sm">
      {getBadgeLabel(status)}
    </Badge>
  );
}

function getBackgroundColor(status: RestaurantStatus) {
  switch (status) {
    case "open":
      return "brand.400";
    case "close":
      return "blackAlpha.700";
  }
}

function getVariant(status: RestaurantStatus) {
  switch (status) {
    case "open":
    case "close":
      return "solid";
    case "full":
      return "outline";
  }
}

function getBadgeLabel(status: RestaurantStatus) {
  switch (status) {
    case "open":
      return "○ 今すぐ入れます！";
    case "full":
      return "△ 空席わずか";
    case "close":
      return "× 入店不可";
  }
}
