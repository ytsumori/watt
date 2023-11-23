import prisma from "@/lib/prisma";
import HomePage from "@/components/home-page";
import { RESTAURANTS } from "@/constants/restaurants";

export default async function Home() {
  // // TODO: uncomment to use DB
  // const restaurants = await prisma.restaurant.findMany();
  const restaurants = RESTAURANTS;
  return <HomePage restaurants={restaurants} />;
}
