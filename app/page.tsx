import prisma from "@/lib/prisma";
import HomePage from "@/components/home-page";

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany();
  return <HomePage restaurants={restaurants} />;
}
