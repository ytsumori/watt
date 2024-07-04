import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { updateOpeningHours } from "@/actions/restaurant-google-map-opening-hour";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, googleMapPlaceId: true, meals: true },
    where: {
      meals: {
        some: {
          isDiscarded: false
        }
      }
    }
  });
  await Promise.all(
    restaurants.map(
      async (restaurant) =>
        await updateOpeningHours({ restaurantId: restaurant.id, googleMapPlaceId: restaurant.googleMapPlaceId })
    )
  );

  return NextResponse.json({ success: true });
}
