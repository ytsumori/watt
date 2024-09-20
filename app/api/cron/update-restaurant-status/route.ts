import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { isCurrentlyWorkingHour, mergeOpeningHours } from "@/utils/opening-hours";

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
      manualCloses: { take: 1, orderBy: { createdAt: "desc" } },
      openingHours: true,
      holidays: { include: { openingHours: true } }
    },
    where: { isPublished: true, meals: { some: { isInactive: false } } }
  });

  const update = async (
    restaurant: Prisma.RestaurantGetPayload<{
      include: {
        manualCloses: { take: 1; orderBy: { createdAt: "desc" } };
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

    const manualCloses = restaurant.manualCloses;

    if (isCurrentlyWorkingHour(openingHours)) {
      if (manualCloses.length === 0) {
        await prisma.restaurant.update({ where: { id: restaurant.id }, data: { isAvailable: true } });
        return NextResponse.json({ success: true });
      } else {
        const closedHour = manualCloses[0].googleMapOpeningHourId
          ? await prisma.restaurantGoogleMapOpeningHour.findUnique({
              where: { id: manualCloses[0].googleMapOpeningHourId }
            })
          : manualCloses[0].holidayOpeningHourId &&
            (await prisma.restaurantHolidayOpeningHour.findUnique({
              where: { id: manualCloses[0].holidayOpeningHourId }
            }));

        // 現在が前回手動で閉めた時間帯でない場合は営業中に変更
        if (closedHour && !isCurrentlyWorkingHour([closedHour])) {
          prisma.$transaction(async (tx) => {
            await tx.restaurantManualClose.delete({ where: { id: manualCloses[0].id } });
            await tx.restaurant.update({ where: { id: restaurant.id }, data: { isAvailable: true } });
          });
        }
      }
    } else {
      prisma.$transaction(async (tx) => {
        manualCloses.length !== 0 && (await tx.restaurantManualClose.delete({ where: { id: manualCloses[0].id } }));
        await tx.restaurant.update({ where: { id: restaurant.id }, data: { isAvailable: false } });
      });
      return NextResponse.json({ success: true });
    }
  };

  await Promise.all(restaurants.map(update));

  return NextResponse.json({ success: true });
}
