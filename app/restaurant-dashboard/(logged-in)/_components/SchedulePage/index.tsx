"use client";

import { Box, Button, Divider, Heading, Text, useToast } from "@chakra-ui/react";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { getRestaurantOpeningInfo, updateBusinessHours } from "./actions";
import { ScheduleListItem } from "./_components/ScheduleListItem";
import { dayOfWeekToNumber } from "@/utils/day-of-week";
import { RepeatIcon } from "@chakra-ui/icons";
import { RestaurantIdContext } from "../RestaurantIdProvider";
import { StatusRadioGroup } from "./_components/StatusRadioGroup";
import { IsOpenSwitch } from "./_components/IsOpenSwitch";

export function SchedulePage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [restaurant, setRestaurant] = useState<
    Prisma.RestaurantGetPayload<{
      select: {
        isOpen: true;
        isFullStatusAvailable: true;
        status: true;
        openingHours: true;
      };
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
        toast({
          title: "エラー",
          description: "営業情報を取得できませんでした",
          status: "error",
          isClosable: true
        })
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
        toast({
          title: "エラー",
          description: "営業時間の更新に失敗しました",
          status: "error",
          isClosable: true
        });
      });
  };

  return (
    <>
      {restaurant?.isFullStatusAvailable ? (
        <StatusRadioGroup restaurantId={restaurantId} status={restaurant.status} />
      ) : (
        <IsOpenSwitch
          restaurantId={restaurantId}
          isRestaurantOpen={!!restaurant?.isOpen}
          onChange={revalidateOpeningInfo}
        />
      )}
      <Heading size="md" mt={6}>
        営業時間の自動開店・閉店設定
      </Heading>
      <Text fontSize="xs">設定している時間帯は自動的に入店可否が更新されます</Text>
      <Box mt={4}>
        <Button leftIcon={<RepeatIcon />} onClick={handleUpdateOpeningHoursClick} isLoading={isUpdating}>
          最新の営業時間に更新
        </Button>
        {restaurant?.openingHours
          ?.sort((a, b) => dayOfWeekToNumber(a.openDayOfWeek) - dayOfWeekToNumber(b.openDayOfWeek))
          .map((openingHour, index) => {
            return (
              <Fragment key={openingHour.id}>
                <ScheduleListItem openingHour={openingHour} />
                {index === restaurant.openingHours.length - 1 ? null : <Divider />}
              </Fragment>
            );
          })}
      </Box>
    </>
  );
}
