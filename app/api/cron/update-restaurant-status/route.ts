import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { getRestaurantBusinessStatus } from "@/lib/places-api";
import { Restaurant } from "@prisma/client";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const restaurants = await prisma.restaurant.findMany();
  const updateRestaurantStatus = async (restaurant: Restaurant) => {
    const { currentOpeningHours } = await getRestaurantBusinessStatus({
      placeId: restaurant.googleMapPlaceId,
    });
    console.log("restaurant id", restaurant.id);
    console.log("currentOpeningHours", currentOpeningHours);
    if (!currentOpeningHours) return;
    if (currentOpeningHours.openNow) {
      if (!restaurant.isOpenManuallyUpdated && !restaurant.isOpen) {
        console.log("restaurant is closed and should be open now");
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { isOpen: true, isOpenManuallyUpdated: false },
        });
      }
    } else {
      if (restaurant.isOpen) {
        console.log("restaurant is open and should be closed now");
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
