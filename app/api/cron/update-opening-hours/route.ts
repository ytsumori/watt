import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Restaurant } from "@prisma/client";
import { getOpeningHours } from "@/lib/places-api";
import { dayNumberToDayOfWeek } from "@/utils/day-of-week";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    include: { meals: true },
    where: {
      meals: {
        some: {
          isDiscarded: false
        }
      }
    }
  });

  const updateOpeningHours = async (restaurant: Restaurant) => {
    const previousOpeningHours = await prisma.restaurantGoogleMapOpeningHour.findMany({
      where: {
        restaurantId: restaurant.id
      }
    });
    const { currentOpeningHours } = await getOpeningHours({
      placeId: restaurant.googleMapPlaceId
    });
    if (!currentOpeningHours) {
      if (previousOpeningHours.length > 0) {
        await prisma.restaurantGoogleMapOpeningHour.deleteMany({
          where: {
            restaurantId: restaurant.id
          }
        });
      }
      return;
    }

    const isSameOpeningHours =
      previousOpeningHours.length === currentOpeningHours.periods.length &&
      previousOpeningHours.every((previousOpeningHour) => {
        const key = `${previousOpeningHour.openDayOfWeek}-${previousOpeningHour.openHour}-${previousOpeningHour.openMinute}-${previousOpeningHour.closeDayOfWeek}-${previousOpeningHour.closeHour}-${previousOpeningHour.closeMinute}`;
        return currentOpeningHours.periods.some((period) => {
          return (
            `${dayNumberToDayOfWeek(period.open.day)}-${period.open.hour}-${period.open.minute}-${dayNumberToDayOfWeek(period.close.day)}-${period.close.hour}-${period.close.minute}` ===
            key
          );
        });
      });
    if (isSameOpeningHours) return;

    await prisma.$transaction([
      prisma.restaurantGoogleMapOpeningHour.deleteMany({
        where: {
          restaurantId: restaurant.id
        }
      }),
      prisma.restaurantGoogleMapOpeningHour.createMany({
        data: currentOpeningHours.periods.map((period) => ({
          restaurantId: restaurant.id,
          openDayOfWeek: dayNumberToDayOfWeek(period.open.day),
          openHour: period.open.hour,
          openMinute: period.open.minute,
          closeDayOfWeek: dayNumberToDayOfWeek(period.close.day),
          closeHour: period.close.hour,
          closeMinute: period.close.minute
        }))
      })
    ]);
  };
  await Promise.all(restaurants.map(updateOpeningHours));

  return NextResponse.json({ success: true });
}
