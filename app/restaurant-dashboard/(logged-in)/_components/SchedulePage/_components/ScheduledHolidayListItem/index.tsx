"use client";

import { translateDayOfWeek } from "@/lib/prisma/translate-enum";
import { Flex, Spacer, Switch, Text, useToast } from "@chakra-ui/react";
import { RestaurantGoogleMapOpeningHour, RestaurantHolidayOpeningHour } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { updateHolidayIsAutomaticallyApplied } from "./action";

type Props = {
  openingHour: RestaurantHolidayOpeningHour;
};

export function ScheduledHolidayListItem({ openingHour }: Props) {
  const [isAutomaticallyApplied, setIsAutomaticallyApplied] = useState<boolean>(openingHour.isAutomaticallyApplied);
  const toast = useToast();

  const handleAutomaticallyAppliedChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isApplied = event.target.checked;
    updateHolidayIsAutomaticallyApplied(openingHour.id, isApplied)
      .then(() => {
        setIsAutomaticallyApplied(isApplied);
      })
      .catch(() => {
        setIsAutomaticallyApplied(!isApplied);
        toast({
          title: "エラー",
          description: "自動適用の変更に失敗しました",
          status: "error",
          isClosable: true
        });
      });
  };
  return (
    <Flex my={2}>
      <Text>
        {translateDayOfWeek(openingHour.openDayOfWeek)}曜日 {String(openingHour.openHour).padStart(2, "0")}:
        {String(openingHour.openMinute).padStart(2, "0")}〜{String(openingHour.closeHour).padStart(2, "0")}:
        {String(openingHour.closeMinute).padStart(2, "0")}
      </Text>
      <Spacer />
      <Switch onChange={handleAutomaticallyAppliedChange} isChecked={isAutomaticallyApplied} />
    </Flex>
  );
}
