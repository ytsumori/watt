import { Badge } from "@chakra-ui/react";
import { RestaurantStatus } from "@/utils/restaurant-status";

type Props = {
  status: RestaurantStatus;
  openAt?: string;
};

export function StatusBadge({ status, openAt }: Props) {
  return (
    <Badge backgroundColor={getBackgroundColor(status)} variant={getVariant(status)} fontSize="sm">
      {getBadgeLabel(status, openAt)}
    </Badge>
  );
}

function getBackgroundColor(status: RestaurantStatus) {
  switch (status) {
    case "open":
      return "brand.400";
    case "close":
    case "full":
      return "blackAlpha.700";
  }
}

function getVariant(status: RestaurantStatus) {
  switch (status) {
    case "open":
    case "close":
    case "full":
      return "solid";
    case "packed":
      return "outline";
  }
}

function getBadgeLabel(status: RestaurantStatus, openAt?: string) {
  switch (status) {
    case "open":
      return "○ 空席あり";
    case "packed":
      return "△ 空席わずか";
    case "close":
      return `× 準備中${openAt ? `（${openAt}営業再開）` : ""}`;
    case "full":
      return "× 満席";
  }
}
