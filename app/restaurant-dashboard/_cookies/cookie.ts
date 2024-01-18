"use server";

import { cookies } from "next/headers";

export async function setRestaurantIdCookie({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const cookieStore = cookies();
  cookieStore.set("restaurantId", restaurantId);
}

export async function getRestaurantIdCookie() {
  const cookieStore = cookies();
  const restaurantId = cookieStore.get("restaurantId");
  return restaurantId?.value;
}
