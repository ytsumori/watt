import HomePage from "@/app/(user-app)/_components/HomePage";
import prisma from "@/lib/prisma/client";
import { dayNumberToDayOfWeek } from "@/utils/day-of-week";

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      meals: {
        where: { isDiscarded: false },
        orderBy: { price: "asc" },
        select: { id: true, title: true, price: true, imagePath: true }
      },
      googleMapPlaceInfo: { select: { latitude: true, longitude: true } },
      openingHours: {
        where: {
          OR: [
            { openDayOfWeek: dayNumberToDayOfWeek(new Date().getDay()) },
            { closeDayOfWeek: dayNumberToDayOfWeek(new Date().getDay()) }
          ]
        },
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
    where: { meals: { some: { isDiscarded: false } } },
    orderBy: { isOpen: "desc" }
  });
  return <HomePage restaurants={restaurants} />;
}
