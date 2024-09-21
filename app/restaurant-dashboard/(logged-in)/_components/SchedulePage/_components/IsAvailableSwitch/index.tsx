"use client";

import { setRestaurantAvailable, setRestaurantUnavailable } from "@/actions/mutations/restaurant";
import { FormControl, FormHelperText, FormLabel, HStack, Switch, useToast } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { Prisma } from "@prisma/client";
import { getCurrentOpeningHour, mergeOpeningHours } from "@/utils/opening-hours";

type Props = {
  restaurantId: string;
  restaurant?: Prisma.RestaurantGetPayload<{
    select: { isAvailable: true; openingHours: true; holidays: { select: { date: true; openingHours: true } } };
  }>;
  isRestaurantAvailable: boolean;
  onChange: (isOpen: boolean) => void;
};

export function IsAvailableSwitch({ restaurantId, restaurant, isRestaurantAvailable, onChange }: Props) {
  const toast = useToast();
  const mergedOpeningHours =
    restaurant &&
    mergeOpeningHours({
      regularOpeningHours: restaurant.openingHours,
      holidays: restaurant.holidays
    });

  const currentOpeningHour = mergedOpeningHours && getCurrentOpeningHour(mergedOpeningHours);

  const handleOpenStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isAvailable = event.target.checked;
    if (isAvailable) {
      setRestaurantAvailable(restaurantId)
        .then(() => onChange(isAvailable))
        .catch(() =>
          toast({
            title: "エラー",
            description: "入店可否ステータスの変更に失敗しました",
            status: "error",
            isClosable: true
          })
        );
    } else {
      setRestaurantUnavailable(restaurantId)
        .then(() => onChange(isAvailable))
        .catch(() =>
          toast({
            title: "エラー",
            description: "入店可否ステータスの変更に失敗しました",
            status: "error",
            isClosable: true
          })
        );
    }
  };

  return (
    <FormControl>
      <HStack>
        <FormLabel mb={0}>現在入店可能</FormLabel>
        <Switch disabled={!currentOpeningHour} onChange={handleOpenStatusChange} isChecked={isRestaurantAvailable} />
      </HStack>
      <FormHelperText>お客さんを案内できない場合はオフにしてください</FormHelperText>
    </FormControl>
  );
}
