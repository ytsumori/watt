import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { isOpenNow } from "./_util";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const restaurants = await prisma.restaurant.findMany({
    include: { meals: true, openingHours: true },
    where: {
      meals: {
        some: {
          isDiscarded: false,
        },
      },
    },
  });

  const updateRestaurantStatus = async (
    restaurant: Prisma.RestaurantGetPayload<{ include: { openingHours: true } }>
  ) => {
    if (restaurant.openingHours.length === 0) return;
    if (isOpenNow(restaurant.openingHours)) {
      if (!restaurant.isOpenManuallyUpdated && !restaurant.isOpen) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { isOpen: true, isOpenManuallyUpdated: false },
        });
      }
    } else {
      if (restaurant.isOpen) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { isOpen: false, isOpenManuallyUpdated: false },
        });
      }
    }
  };
  await Promise.all(restaurants.map(updateRestaurantStatus));

  return NextResponse.json({ status: "ok" });
}
