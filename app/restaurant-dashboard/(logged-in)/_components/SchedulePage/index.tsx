"use client";

import { Box, Button, Divider, Heading, Text, useToast } from "@chakra-ui/react";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { RestaurantGoogleMapOpeningHour } from "@prisma/client";
import { getRestaurantOpeningInfo, updateBusinessHours } from "./actions";
import { ScheduleListItem } from "./_components/ScheduleListItem";
import { dayOfWeekToNumber } from "@/utils/day-of-week";
import { RepeatIcon } from "@chakra-ui/icons";
import { RestaurantIdContext } from "../RestaurantIdProvider";
import { StatusRadioGroup } from "./_components/StatusRadioGroup";
import { IsOpenSwitch } from "./_components/IsOpenSwitch";
import { getRestaurantStatus } from "@/utils/restaurant-status";

export function SchedulePage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean>();
  const [isFull, setIsFull] = useState<boolean>();
  const [openingHours, setOpeningHours] = useState<RestaurantGoogleMapOpeningHour[]>();
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  const revalidateOpeningInfo = useCallback(() => {
    getRestaurantOpeningInfo(restaurantId)
      .then((restaurant) => {
        if (!restaurant) return;

        setIsRestaurantOpen(restaurant.isOpen);
        if (restaurant.isFullStatusAvailable) {
          setIsFull(restaurant.fullStatuses.some((status) => status.easedAt === null));
        }
        setOpeningHours(restaurant.openingHours);
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
      {isFull !== undefined ? (
        <StatusRadioGroup
          restaurantId={restaurantId}
          status={getRestaurantStatus({ isOpen: !!isRestaurantOpen, isFull })}
        />
      ) : (
        <IsOpenSwitch
          restaurantId={restaurantId}
          isRestaurantOpen={!!isRestaurantOpen}
          onChange={setIsRestaurantOpen}
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
        {openingHours
          ?.sort((a, b) => dayOfWeekToNumber(a.openDayOfWeek) - dayOfWeekToNumber(b.openDayOfWeek))
          .map((openingHour, index) => {
            return (
              <Fragment key={openingHour.id}>
                <ScheduleListItem openingHour={openingHour} />
                {index === openingHours.length - 1 ? null : <Divider />}
              </Fragment>
            );
          })}
      </Box>
    </>
  );
}
