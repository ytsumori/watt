import prisma from "@/lib/prisma";
import Map from "@/components/map";

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany();
  return <Map restaurants={restaurants} />;
}
