import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { getPlaceDetail } from "@/lib/places-api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (token !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    include: { googleMapPlaceInfo: true },
  });

  const updateGoogleMapPlaceInfo = async (
    restaurant: Prisma.RestaurantGetPayload<{ include: { googleMapPlaceInfo: true } }>
  ) => {
    if (restaurant.googleMapPlaceInfo) return;
    const result = await getPlaceDetail({ placeId: restaurant.googleMapPlaceId });

    await prisma.restaurantGoogleMapPlaceInfo.create({
      data: {
        restaurantId: restaurant.id,
        url: result.googleMapsUri,
        latitude: result.location.latitude,
        longitude: result.location.longitude,
      },
    });
  };
  await Promise.all(restaurants.map(updateGoogleMapPlaceInfo));

  return NextResponse.json({ status: "ok" });
}
