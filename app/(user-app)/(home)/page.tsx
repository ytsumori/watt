import prisma from "@/lib/prisma/client";
import { FirstOnboardingModal } from "./_components/FirstOnboardingModal";
import HomePage from "./_components/HomePage";
import { Flex } from "@chakra-ui/react";
import { LogoHeader } from "../_components/LogoHeader";
import { createTodayDateNumber } from "@/utils/opening-hours";
import { getServerSession } from "next-auth";
import { options } from "@/lib/next-auth/options";
import { redirect } from "next/navigation";
import { HomeRestaurantHalfModal } from "./_components/HomePage/components/HomeRestaurantHalfModal";
import { RestaurantHalfModal } from "../_components/RestaurantHalfModal";

type SearchParams = {
  selectedRestaurantId?: string;
};

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const todayNumber = createTodayDateNumber();
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      isAvailable: true,
      interiorImagePath: true,
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

  const selectedRestaurant = searchParams.selectedRestaurantId
    ? await prisma.restaurant.findUnique({
        where: { id: searchParams.selectedRestaurantId },
        select: {
          id: true,
          name: true,
          meals: {
            where: { isInactive: false, outdatedAt: null },
            orderBy: { price: "asc" },
            include: { items: { include: { options: { orderBy: { position: "asc" } } } } }
          },
          googleMapPlaceInfo: { select: { url: true, latitude: true, longitude: true } },
          paymentOptions: true,
          openingHours: true,
          exteriorImage: true,
          menuImages: { orderBy: { menuNumber: "asc" } },
          smokingOption: true,
          interiorImagePath: true,
          isAvailable: true
        }
      })
    : null;
  if (searchParams.selectedRestaurantId !== undefined && selectedRestaurant === null) {
    redirect("/");
  }
  const session = await getServerSession(options);

  return (
    <>
      <Flex h="100svh" w="100vw" direction="column">
        <LogoHeader />
        <HomePage restaurants={restaurants} />
      </Flex>
      <FirstOnboardingModal />
      {selectedRestaurant && (
        <HomeRestaurantHalfModal isOpen={true} restaurant={selectedRestaurant} userId={session?.user.id} />
      )}
    </>
  );
}
