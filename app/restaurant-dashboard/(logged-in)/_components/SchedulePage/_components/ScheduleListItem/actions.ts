"use server";

import prisma from "@/lib/prisma/client";

export async function updateIsAutomaticallyApplied(openingHourId: string, isAutomaticallyApplied: boolean) {
  return await prisma.restaurantGoogleMapOpeningHour.update({
    where: { id: openingHourId },
    data: { isAutomaticallyApplied }
  });
}
