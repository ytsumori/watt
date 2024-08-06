import HomePage from "@/app/(user-app)/_components/HomePage";
import prisma from "@/lib/prisma/client";

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
    orderBy: { isOpen: "desc" }
  });
  return <HomePage restaurants={restaurants} />;
}
