"use server";

import prisma from "@/lib/prisma/client";

export async function getRestaurantOpeningInfo(restaurantId: string) {
  return await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: {
      isOpen: true,
      openingHours: {
        orderBy: {
          openHour: "asc"
        }
      }
    }
  });
}
