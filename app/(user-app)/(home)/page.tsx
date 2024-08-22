import prisma from "@/lib/prisma/client";
import { FirstOnboardingModal } from "./_components/FirstOnboardingModal";
import HomePage from "./_components/HomePage";
import { Flex } from "@chakra-ui/react";
import { LogoHeader } from "../_components/LogoHeader";

export default async function Home() {
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
      }
    },
    where: { isPublished: true, meals: { some: { isInactive: false } } },
    orderBy: { status: "asc" }
  });
  return (
    <Flex h="100svh" w="100vw" direction="column">
      <LogoHeader />
      <HomePage restaurants={restaurants} />
      <FirstOnboardingModal />
    </Flex>
  );
}
