import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Restaurant } from "@prisma/client";
import { getOpeningHours } from "@/lib/places-api";
import { dayNumberToDayOfWeek } from "@/utils/day-of-week";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    include: { meals: true },
    where: {
      meals: {
        some: {
          isDiscarded: false,
        },
      },
    },
  });

  const updateOpeningHours = async (restaurant: Restaurant) => {
    await prisma.restaurantGoogleMapOpeningHour.deleteMany({
      where: {
        restaurantId: restaurant.id,
      },
    });
    const { currentOpeningHours } = await getOpeningHours({
      placeId: restaurant.googleMapPlaceId,
    });
    if (!currentOpeningHours || currentOpeningHours.periods.length === 0) return;

    await prisma.restaurantGoogleMapOpeningHour.createMany({
      data: currentOpeningHours.periods.map((period) => ({
        restaurantId: restaurant.id,
        openDayOfWeek: dayNumberToDayOfWeek(period.open.day),
        openHour: period.open.hour,
        openMinute: period.open.minute,
        closeDayOfWeek: dayNumberToDayOfWeek(period.close.day),
        closeHour: period.close.hour,
        closeMinute: period.close.minute,
      })),
    });
  };
  await Promise.all(restaurants.map(updateOpeningHours));

  return NextResponse.json({ status: "ok" });
}
