import { Badge } from "@chakra-ui/react";
import { RestaurantStatus } from "@prisma/client";

type Props = {
  status: RestaurantStatus;
  isWorkingHour: boolean;
  nextOpenAt?: string;
};

export function StatusBadge({ status, isWorkingHour, nextOpenAt }: Props) {
  return (
    <Badge backgroundColor={getBackgroundColor(status)} variant={getVariant(status)} fontSize="sm">
      {getBadgeLabel(status, isWorkingHour, nextOpenAt)}
    </Badge>
  );
}

function getBackgroundColor(status: RestaurantStatus) {
  switch (status) {
    case "OPEN":
      return "brand.400";
    case "CLOSED":
    case "PACKED":
      return "blackAlpha.700";
  }
}

function getVariant(status: RestaurantStatus) {
  switch (status) {
    case "OPEN":
    case "CLOSED":
      return "solid";
    case "PACKED":
      return "outline";
  }
}

function getBadgeLabel(status: RestaurantStatus, isWorkingHour: boolean, nextOpenAt?: string) {
  switch (status) {
    case "OPEN":
      return "○ 空席あり";
    case "PACKED":
      return "△ 空席わずか";
    case "CLOSED":
      return isWorkingHour ? "× 満席" : `× 準備中${nextOpenAt ? `（${nextOpenAt}営業再開）` : ""}`;
  }
}
