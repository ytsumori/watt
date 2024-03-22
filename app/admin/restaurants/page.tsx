import prisma from "@/lib/prisma/client";
import { RestaurantsPage } from "./_components/RestaurantsPage";

export default async function Restaurants() {
  const restaurants = await prisma.restaurant.findMany();
  return <RestaurantsPage restaurants={restaurants} />;
}
