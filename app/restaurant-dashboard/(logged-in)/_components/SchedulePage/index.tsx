"use client";

import {
  Box,
  Button,
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
import { ChangeEvent, Fragment, useCallback, useContext, useEffect, useState } from "react";
import { RestaurantGoogleMapOpeningHour } from "@prisma/client";
import { getRestaurantOpeningInfo, updateBusinessHours } from "./actions";
import { ScheduleListItem } from "./_components/ScheduleListItem";
import { dayOfWeekToNumber } from "@/utils/day-of-week";
import { RepeatIcon } from "@chakra-ui/icons";
import { RestaurantIdContext } from "../RestaurantIdProvider";
import { updateIsOpen } from "@/actions/mutations/restaurant";

export function SchedulePage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState<boolean>();
  const [openingHours, setOpeningHours] = useState<RestaurantGoogleMapOpeningHour[]>();
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  const revalidateOpeningInfo = useCallback(() => {
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

  useEffect(() => {
    revalidateOpeningInfo();
  }, [revalidateOpeningInfo]);

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
