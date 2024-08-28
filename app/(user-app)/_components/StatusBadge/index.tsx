import { Badge } from "@chakra-ui/react";

type Props = {
  isAvailable: boolean;
  isWorkingHour: boolean;
  nextOpenAt?: string;
};

export function StatusBadge({ isAvailable, isWorkingHour, nextOpenAt }: Props) {
  return (
    <Badge backgroundColor={isAvailable ? undefined : "blackAlpha.700"} variant="solid" fontSize="sm">
      {getBadgeLabel(isAvailable, isWorkingHour, nextOpenAt)}
    </Badge>
  );
}

function getBadgeLabel(isAvailable: boolean, isWorkingHour: boolean, nextOpenAt?: string) {
  if (isAvailable) {
    return "空き確認できます";
  } else {
    return isWorkingHour ? "× 空き確認できません" : `× 準備中${nextOpenAt ? `（${nextOpenAt}営業再開）` : ""}`;
  }
}
