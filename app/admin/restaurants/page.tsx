import prisma from "@/lib/prisma/client";
import { RestaurantsPageClient } from "./_components/page-client";

export default async function RestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany();
  return <RestaurantsPageClient restaurants={restaurants} />;
}
