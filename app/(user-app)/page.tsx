import prisma from "@/lib/prisma/client";
import HomePage from "./_components/page-client";

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
