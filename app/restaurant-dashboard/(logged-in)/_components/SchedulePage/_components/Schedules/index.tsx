"use client";
import { Box, Divider, Flex, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { DayOfWeek, Prisma, RestaurantGoogleMapOpeningHour, RestaurantHolidayOpeningHour } from "@prisma/client";
import { Fragment } from "react";
import { ScheduledHolidayListItem } from "../ScheduledHolidayListItem";
import { ScheduleListItem } from "../ScheduleListItem";
import { translateDayOfWeek } from "@/lib/prisma/translate-enum";

type Props = {
  restaurant?: Prisma.RestaurantGetPayload<{
    select: { isAvailable: true; openingHours: true; holidays: { select: { date: true; openingHours: true } } };
  }>;
};

export const Schedules = ({ restaurant }: Props) => {
  const regularOpeningHoursGropuedByDayOfWeek =
    restaurant?.openingHours &&
    (Object.groupBy(restaurant?.openingHours, (openingHour) => openingHour.openDayOfWeek) as {
      [K in keyof typeof DayOfWeek]: RestaurantGoogleMapOpeningHour[];
    });

  const flattedHolidayOpeningHours = restaurant?.holidays
    .map((holiday) => holiday.openingHours.map((openingHour) => ({ ...openingHour, date: holiday.date })))
    .flat();

  const holidayOpeningHoursGroupedByDayOfWeek =
    flattedHolidayOpeningHours &&
    Object.groupBy(flattedHolidayOpeningHours, (holidayOpeningHour) => holidayOpeningHour.openDayOfWeek);

  const openingHours = Object.values(DayOfWeek).reduce((acc, dayOfWeek) => {
    const regularOpeningHours =
      regularOpeningHoursGropuedByDayOfWeek && regularOpeningHoursGropuedByDayOfWeek[dayOfWeek];
    const holidayOpeningHours =
      holidayOpeningHoursGroupedByDayOfWeek && holidayOpeningHoursGroupedByDayOfWeek[dayOfWeek];
    return {
      ...acc,
      [dayOfWeek]: {
        regularOpeningHours: regularOpeningHours ? regularOpeningHours : [],
        holidayOpeningHours: holidayOpeningHours ? holidayOpeningHours : []
      }
    };
  }, {}) as {
    [K in keyof typeof DayOfWeek]: {
      regularOpeningHours: RestaurantGoogleMapOpeningHour[];
      holidayOpeningHours: (RestaurantHolidayOpeningHour & { date: number })[];
    };
  };

  const dayOfWeeks = Object.values(DayOfWeek);
  const last = dayOfWeeks.pop();

  return (
    <>
      {openingHours &&
        last &&
        [last, ...dayOfWeeks].map((dayOfWeek, idx) => {
          const openingHour = openingHours[dayOfWeek];
          return (
            <Box key={dayOfWeek} m={2}>
              <Text>{translateDayOfWeek(dayOfWeek) + "曜日"}</Text>
              <UnorderedList>
                {openingHour.regularOpeningHours.map((regularHour, idx) => {
                  return (
                    <Fragment key={regularHour.id}>
                      <ScheduleListItem openingHour={regularHour} />
                    </Fragment>
                  );
                })}
              </UnorderedList>
              {openingHour.holidayOpeningHours[0] && (
                <Box borderColor="gray" borderWidth={1} borderRadius={5} p={3}>
                  <Text>
                    <Text as="span" fontWeight="bold">
                      {Number(openingHour.holidayOpeningHours[0].date.toString().slice(4, 6))}/
                      {Number(openingHour.holidayOpeningHours[0].date.toString().slice(6, 8))}
                    </Text>{" "}
                    特別営業時間
                  </Text>
                  <UnorderedList>
                    <>
                      <UnorderedList>
                        {openingHour.holidayOpeningHours.map((holidayHour) => {
                          return (
                            <ListItem key={holidayHour.id}>
                              <Flex gap={3}>
                                <ScheduledHolidayListItem openingHour={holidayHour} />
                              </Flex>
                            </ListItem>
                          );
                        })}
                      </UnorderedList>
                    </>
                  </UnorderedList>
                </Box>
              )}

              {[last, ...dayOfWeeks].length - 1 !== idx && <Divider borderColor="black" mt={2} />}
            </Box>
          );
        })}
    </>
  );
};
