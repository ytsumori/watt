import { RestaurantsPageClient } from "./_components/page-client";
import prisma from "@/lib/prisma/client";

export default async function RestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      tokens: true,
    },
  });
  return <RestaurantsPageClient restaurants={restaurants} />;
}
