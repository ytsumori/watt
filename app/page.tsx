import prisma from "@/lib/prisma";
import HomePage from "@/components/home-page";
import { RESTAURANTS } from "@/constants/restaurants";
import "./global.css";

export default async function Home() {
  const restaurants = RESTAURANTS;
  return <HomePage restaurants={restaurants} />;
}
