"use client";

import { Box, Button, Heading, Text, useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { getRestaurantOpeningInfo, updateBusinessHours } from "./actions";
import { RepeatIcon } from "@chakra-ui/icons";
import { RestaurantIdContext } from "../RestaurantIdProvider";
import { IsAvailableSwitch } from "./_components/IsAvailableSwitch";

import { Schedules } from "./_components/Schedules";

export function SchedulePage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [restaurant, setRestaurant] = useState<
    Prisma.RestaurantGetPayload<{
      select: { isAvailable: true; openingHours: true; holidays: { select: { date: true; openingHours: true } } };
    }>
  >();
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  const revalidateOpeningInfo = useCallback(() => {
    getRestaurantOpeningInfo(restaurantId)
      .then((restaurant) => {
        if (!restaurant) return;

        setRestaurant(restaurant);
      })
      .catch(() =>
        toast({ title: "エラー", description: "営業情報を取得できませんでした", status: "error", isClosable: true })
      );
  }, [restaurantId, toast]);

  useEffect(() => {
    revalidateOpeningInfo();
  }, [revalidateOpeningInfo]);

  const handleUpdateOpeningHoursClick = () => {
    setIsUpdating(true);
    updateBusinessHours({ restaurantId })
      .then(() => {
        revalidateOpeningInfo();
        setIsUpdating(false);
      })
      .catch(() => {
        setIsUpdating(false);
        toast({ title: "エラー", description: "営業時間の更新に失敗しました", status: "error", isClosable: true });
      });
  };

  return (
    <>
      <IsAvailableSwitch
        restaurantId={restaurantId}
        restaurant={restaurant}
        isRestaurantAvailable={restaurant?.isAvailable ?? false}
        onChange={revalidateOpeningInfo}
      />
      <Heading size="md" mt={6}>
        営業時間の自動開店・閉店設定
      </Heading>
      <Text fontSize="xs">設定している時間帯は自動的に入店可否が更新されます</Text>
      <Box mt={4}>
        <Button leftIcon={<RepeatIcon />} onClick={handleUpdateOpeningHoursClick} isLoading={isUpdating}>
          最新の営業時間に更新
        </Button>
      </Box>
      <Schedules restaurant={restaurant} />
    </>
  );
}
