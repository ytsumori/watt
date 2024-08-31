"use server";

import prisma from "@/lib/prisma/client";

export async function updateHolidayIsAutomaticallyApplied(openingHourId: string, isAutomaticallyApplied: boolean) {
  return await prisma.restaurantHolidayOpeningHour.update({
    where: { id: openingHourId },
    data: { isAutomaticallyApplied }
  });
}
