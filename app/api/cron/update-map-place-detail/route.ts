import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { getPlaceDetail } from "@/lib/places-api";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    include: { googleMapPlaceInfo: true }
  });

  const createGoogleMapPlaceInfo = async (
    restaurant: Prisma.RestaurantGetPayload<{ include: { googleMapPlaceInfo: true } }>
  ) => {
    const result = await getPlaceDetail({ placeId: restaurant.googleMapPlaceId });
    if (restaurant.googleMapPlaceInfo) {
      await prisma.restaurantGoogleMapPlaceInfo.update({
        where: {
          id: restaurant.googleMapPlaceInfo.id
        },
        data: {
          url: result.googleMapsUri,
          latitude: result.location.latitude,
          longitude: result.location.longitude,
          restaurant: {
            update: {
              name: result.displayName.text
            }
          }
        }
      });
    }
  };
  await Promise.all(restaurants.map(createGoogleMapPlaceInfo));

  return NextResponse.json({ success: true });
}
