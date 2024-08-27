import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { updateCurrentOpeningHours } from "@/actions/mutations/restaurant-google-map-opening-hour";
// import { updateCurrentOpeningHours } from "@/actions/mutations/restaurant-google-map-opening-hour";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, googleMapPlaceId: true, meals: true },
    where: { meals: { some: { isInactive: false } } }
  });

  // DEBUG
  const restaurant = restaurants[1];
  await updateCurrentOpeningHours({ restaurantId: restaurant.id, googleMapPlaceId: restaurant.googleMapPlaceId });

  // await Promise.all(
  //   restaurants.map(
  //     async (restaurant) =>
  //       await updateCurrentOpeningHours({ restaurantId: restaurant.id, googleMapPlaceId: restaurant.googleMapPlaceId })
  //   )
  // );

  return NextResponse.json({ success: true });
}
