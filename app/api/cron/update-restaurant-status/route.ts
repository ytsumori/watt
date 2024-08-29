import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { notifyRestaurantToOpen } from "./_actions/notify-restaurant-to-open";
import { updateRestaurantAvailabilityAutomatically } from "@/actions/mutations/restaurant";
import { isCurrentlyWorkingHour } from "@/utils/opening-hours";

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
      openingHours: {
        where: {
          isAutomaticallyApplied: true
        }
      }
    },
    where: {
      meals: {
        some: {
          isInactive: false
        }
      }
    }
  });

  const update = async (restaurant: Prisma.RestaurantGetPayload<{ include: { openingHours: true } }>) => {
    if (restaurant.openingHours.length === 0) return;
    if (isCurrentlyWorkingHour(restaurant.openingHours)) {
      if (!restaurant.isAvailable) {
        const unopenClosedAlert = await prisma.restaurantClosedAlert.findFirst({
          select: {
            id: true,
            closedAt: true,
            notifiedAt: true
          },
          where: {
            openAt: null,
            restaurantId: restaurant.id
          }
        });
        if (unopenClosedAlert) {
          // notify only once if the restaurant is closed before 24 hours ago
          const isClosedBeforeOneDayAgo =
            new Date().getTime() - unopenClosedAlert.closedAt.getTime() > 24 * 60 * 60 * 1000;
          if (!unopenClosedAlert.notifiedAt && isClosedBeforeOneDayAgo) {
            try {
              await notifyRestaurantToOpen({ restaurantId: restaurant.id });
            } catch (e) {
              console.error("Error notifying restaurant to open", e);
            }
            await prisma.restaurantClosedAlert.update({
              where: { id: unopenClosedAlert.id },
              data: { notifiedAt: new Date() }
            });
          }
        } else {
          await updateRestaurantAvailabilityAutomatically({ id: restaurant.id, isAvailable: true });
        }
      }
    } else {
      await updateRestaurantAvailabilityAutomatically({ id: restaurant.id, isAvailable: false });
    }
  };
  await Promise.all(restaurants.map(update));

  return NextResponse.json({ success: true });
}
