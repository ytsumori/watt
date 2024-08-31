import prisma from "@/lib/prisma/client";
import { FirstOnboardingModal } from "./_components/FirstOnboardingModal";
import HomePage from "./_components/HomePage";
import { Flex } from "@chakra-ui/react";
import { LogoHeader } from "../_components/LogoHeader";
import { createTodayDateNumber } from "@/utils/opening-hours";

export default async function Home() {
  const todayNumber = createTodayDateNumber();
  const restaurants = await prisma.restaurant.findMany({
    include: {
      meals: {
        where: { isInactive: false, outdatedAt: null },
        orderBy: { price: "asc" },
        select: { id: true, title: true, price: true, listPrice: true, imagePath: true }
      },
      googleMapPlaceInfo: { select: { latitude: true, longitude: true } },
      openingHours: {
        select: {
          openHour: true,
          openMinute: true,
          openDayOfWeek: true,
          closeHour: true,
          closeMinute: true,
          closeDayOfWeek: true
        }
      },
      holidays: {
        select: {
          date: true,
          openingHours: {
            select: {
              openHour: true,
              openMinute: true,
              openDayOfWeek: true,
              closeHour: true,
              closeMinute: true,
              closeDayOfWeek: true
            }
          }
        },
        where: { date: { equals: todayNumber } }
      }
    },
    where: { isPublished: true, meals: { some: { isInactive: false } } },
    orderBy: { isAvailable: "desc" }
  });
  console.log(restaurants.find((r) => r.name === "豆腐料理 空野 南船場店"));
  return (
    <Flex h="100svh" w="100vw" direction="column">
      <LogoHeader />
      <HomePage restaurants={restaurants} />
      <FirstOnboardingModal />
    </Flex>
  );
}
