import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { getPlaceDetail } from "@/lib/places-api";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    where: { googleMapPlaceInfo: null },
    include: { googleMapPlaceInfo: true }
  });

  const createGoogleMapPlaceInfo = async (
    restaurant: Prisma.RestaurantGetPayload<{ include: { googleMapPlaceInfo: true } }>
  ) => {
    if (restaurant.googleMapPlaceInfo) return;
    const result = await getPlaceDetail({ placeId: restaurant.googleMapPlaceId });

    await prisma.restaurantGoogleMapPlaceInfo.create({
      data: {
        restaurantId: restaurant.id,
        url: result.googleMapsUri,
        latitude: result.location.latitude,
        longitude: result.location.longitude
      }
    });
  };
  await Promise.all(restaurants.map(createGoogleMapPlaceInfo));

  return NextResponse.json({ status: "ok" });
}
