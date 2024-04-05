import prisma from "@/lib/prisma/client";
import { RestaurantsPage } from "./_components/RestaurantsPage";

export default async function Restaurants() {
  const restaurants = await prisma.restaurant.findMany({ include: { googleMapPlaceInfo: { select: { url: true } } } });
  return <RestaurantsPage restaurants={restaurants} />;
}
