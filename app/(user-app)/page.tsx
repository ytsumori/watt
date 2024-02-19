import HomePage from "@/app/(user-app)/_components/page-client";
import prisma from "@/lib/prisma/client";

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      meals: {
        where: {
          isDiscarded: false,
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
