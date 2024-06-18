import HomePage from "@/app/(user-app)/_components/HomePage";
import prisma from "@/lib/prisma/client";

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      meals: { where: { isDiscarded: false }, orderBy: { price: "asc" } },
      googleMapPlaceInfo: { select: { latitude: true, longitude: true } }
    },
    where: { meals: { some: { isDiscarded: false } } },
    orderBy: { isOpen: "desc" }
  });
  return <HomePage restaurants={restaurants} />;
}
