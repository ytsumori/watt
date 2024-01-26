import { RestaurantsPage } from "./_components/page-client";
import prisma from "@/lib/prisma";

export default async function NewPage() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      tokens: true,
    },
  });
  return <RestaurantsPage restaurants={restaurants} />;
}
