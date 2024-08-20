import HomePage from "@/app/(user-app)/(home)/_components/HomePage";
import prisma from "@/lib/prisma/client";
import { FirstOnboardingModal } from "./_components/FirstOnboardingModal";

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
    <>
      <HomePage restaurants={restaurants} />
      <FirstOnboardingModal />
    </>
  );
}
