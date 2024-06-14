"use client";

import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Switch,
  Text,
  useToast
} from "@chakra-ui/react";
import { ChangeEvent, Fragment, useContext, useEffect, useState } from "react";
import { updateIsOpen } from "@/actions/restaurant";

import { RestaurantGoogleMapOpeningHour } from "@prisma/client";
import { getRestaurantOpeningInfo } from "./actions";
import { RestaurantIdContext } from "../restaurant-id-provider";
import { ScheduleListItem } from "./_components/ScheduleListItem";
import { dayOfWeekToNumber } from "@/utils/day-of-week";

export function SchedulePage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean>();
  const [openingHours, setOpeningHours] = useState<RestaurantGoogleMapOpeningHour[]>();
  const toast = useToast();

  useEffect(() => {
    getRestaurantOpeningInfo(restaurantId)
      .then((restaurant) => {
        if (!restaurant) return;

        setIsRestaurantOpen(restaurant.isOpen);
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

  const handleOpenStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isOpen = event.target.checked;
    updateIsOpen({ id: restaurantId, isOpen })
      .then(() => {
        setIsRestaurantOpen(isOpen);
      })
      .catch(() =>
        toast({
          title: "エラー",
          description: "入店可否ステータスの変更に失敗しました",
          status: "error",
          isClosable: true
        })
      );
  };

  return (
    <>
      <FormControl>
        <HStack>
          <FormLabel mb={0}>現在入店可能</FormLabel>
          <Switch onChange={handleOpenStatusChange} isChecked={isRestaurantOpen} />
        </HStack>
        <FormHelperText>お客さんを案内できない場合はオフにしてください</FormHelperText>
      </FormControl>
      <Heading size="md" mt={6}>
        営業時間の自動開店・閉店設定
      </Heading>
      <Text fontSize="xs">設定している時間帯は自動的に入店可否が更新されます</Text>
      <Box mt={4}>
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
