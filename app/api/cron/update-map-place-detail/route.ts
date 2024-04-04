import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { getPlaceDetail } from "@/lib/places-api";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    where: { googleMapPlaceInfo: { is: {} } },
    include: { googleMapPlaceInfo: true },
  });

  const updateGoogleMapPlaceInfo = async (
    restaurant: Prisma.RestaurantGetPayload<{ include: { googleMapPlaceInfo: true } }>
  ) => {
    if (!restaurant.googleMapPlaceInfo) return;
    const result = await getPlaceDetail({ placeId: restaurant.googleMapPlaceId });

    if (
      result.googleMapsUri === restaurant.googleMapPlaceInfo.url &&
      result.location.latitude === restaurant.googleMapPlaceInfo.latitude &&
      result.location.longitude === restaurant.googleMapPlaceInfo.longitude
    ) {
      return;
    }
    console.warn("Google Map Place Info updated", restaurant.id, restaurant.name);
    await prisma.restaurantGoogleMapPlaceInfo.update({
      where: { id: restaurant.googleMapPlaceInfo.id },
      data: {
        url: result.googleMapsUri,
        latitude: result.location.latitude,
        longitude: result.location.longitude,
      },
    });
  };
  await Promise.all(restaurants.map(updateGoogleMapPlaceInfo));

  return NextResponse.json({ status: "ok" });
}
