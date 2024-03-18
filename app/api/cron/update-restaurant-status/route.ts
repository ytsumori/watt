import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { getRestaurantBusinessStatus } from "@/lib/places-api";
import { Restaurant } from "@prisma/client";

export async function GET() {
  const restaurants = await prisma.restaurant.findMany();
  const updateRestaurantStatus = async (restaurant: Restaurant) => {
    const { currentOpeningHours } = await getRestaurantBusinessStatus({
      placeId: restaurant.googleMapPlaceId,
    });
    if (!currentOpeningHours) return;
    if (currentOpeningHours.openNow) {
      if (!restaurant.isOpenManuallyUpdated && !restaurant.isOpen) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { isOpen: true, isOpenManuallyUpdated: false },
        });
      }
    } else {
      if (restaurant.isOpen) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { isOpen: false, isOpenManuallyUpdated: false },
        });
      }
    }
  };
  Promise.all(restaurants.map(updateRestaurantStatus));

  return NextResponse.json({ status: "ok" });
}
