import HomePage from "@/app/(user-app)/_components/HomePageClient";
import prisma from "@/lib/prisma/client";

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      meals: {
        where: {
          isDiscarded: false,
        },
      },
      googleMapPlaceInfo: {
        select: {
          latitude: true,
          longitude: true,
        },
      },
    },
    where: {
      meals: {
        some: {
          isDiscarded: false,
        },
      },
    },
    orderBy: {
      isOpen: "desc",
    },
  });
  const meals = await prisma.meal.findMany({
    include: {
      restaurant: true,
    },
    where: {
      isDiscarded: false,
    },
  });
  return <HomePage restaurants={restaurants} />;
}
