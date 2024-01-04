import HomePage from "@/components/home-page";
import prisma from "@/lib/prisma";

export default async function Home() {
  const restaurants = await prisma.restaurant.findMany();
  return <HomePage restaurants={restaurants} />;
}
