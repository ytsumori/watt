import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { isCurrentlyWorkingHour, mergeOpeningHours } from "@/utils/opening-hours";
import { setRestaurantAvailable, setRestaurantUnavailableAutomatically } from "@/actions/mutations/restaurant";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    include: {
      meals: true,
      manualClose: true,
      openingHours: { where: { isAutomaticallyApplied: true } },
      holidays: { include: { openingHours: { where: { isAutomaticallyApplied: true } } } }
    },
    where: { isPublished: true }
  });

  const update = async (
    restaurant: Prisma.RestaurantGetPayload<{
      include: {
        manualClose: true;
        openingHours: true;
        holidays: { include: { openingHours: true } };
      };
    }>
  ) => {
    const openingHours = mergeOpeningHours({
      regularOpeningHours: restaurant.openingHours,
      holidays: restaurant.holidays
    });

    if (openingHours.length === 0) return;

    if (isCurrentlyWorkingHour(openingHours)) {
      if (!restaurant.manualClose) {
        await prisma.restaurant.update({ where: { id: restaurant.id }, data: { isAvailable: true } });
        return NextResponse.json({ success: true });
      } else {
        const closedHour = restaurant.manualClose.googleMapOpeningHourId
          ? await prisma.restaurantGoogleMapOpeningHour.findUnique({
              where: { id: restaurant.manualClose.googleMapOpeningHourId }
            })
          : restaurant.manualClose.holidayOpeningHourId &&
            (await prisma.restaurantHolidayOpeningHour.findUnique({
              where: { id: restaurant.manualClose.holidayOpeningHourId }
            }));

        // 現在が前回手動で閉めた時間帯でない場合は営業中に変更
        if (closedHour && !isCurrentlyWorkingHour([closedHour])) {
          await setRestaurantAvailable(restaurant.id);
        }
      }
    } else if (restaurant.isAvailable) {
      await setRestaurantUnavailableAutomatically(restaurant.id);
      return NextResponse.json({ success: true });
    }
  };

  await Promise.all(restaurants.map(update));

  return NextResponse.json({ success: true });
}
