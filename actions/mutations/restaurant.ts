"use server";

import prisma from "@/lib/prisma/client";
import { createServiceRoleClient } from "@/lib/supabase/createServiceRoleClient";
import { getCurrentOpeningHour, mergeOpeningHours } from "@/utils/opening-hours";
import { randomUUID } from "crypto";

export async function updateRestaurantAvailability({ id, isAvailable }: { id: string; isAvailable: boolean }) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { openingHours: true, holidays: { select: { openingHours: true, date: true } } }
  });
  if (!restaurant) throw new Error("restaurant not found");

  const mergedOpeningHours = mergeOpeningHours({
    regularOpeningHours: restaurant.openingHours,
    holidays: restaurant.holidays
  });

  const currentHour = getCurrentOpeningHour(mergedOpeningHours);

  return await prisma.$transaction(async (tx) => {
    if (isAvailable) {
      const manualClose = await tx.restaurantManualClose.findFirst({ where: { restaurantId: id } });
      await tx.restaurantManualClose.delete({ where: { id: manualClose?.id } });
    } else {
      if (currentHour) {
        const isHoliday = !!(await tx.restaurantHolidayOpeningHour.findUnique({ where: { id: currentHour.id } }));
        isHoliday
          ? await tx.restaurantManualClose.create({ data: { restaurantId: id, holidayOpeningHourId: currentHour.id } })
          : await tx.restaurantManualClose.create({
              data: { restaurantId: id, googleMapOpeningHourId: currentHour.id }
            });
      }
    }
    return await tx.restaurant.update({ where: { id }, data: { isAvailable } });
  });
}

export async function uploadInteriorImage(restaurantId: string, formData: FormData) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) throw new Error("restaurant not found");

  const file = formData.get("image") as File | null;
  if (!file) throw new Error("file not found");

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage
    .from("restaurant-interiors")
    .upload(`${restaurantId}/${randomUUID()}`, file);
  if (error) {
    console.error("fail to upload image", error);
    throw new Error("fail to upload image", error);
  }

  await prisma.restaurant.update({ where: { id: restaurantId }, data: { interiorImagePath: data.path } });

  return data.path;
}

export async function updateRestaurantPublishment({ id, isPublished }: { id: string; isPublished: boolean }) {
  return await prisma.restaurant.update({
    where: { id },
    data: { isPublished }
  });
}

export async function updateRestaurantTableSeatCount({ id, tableSeatCount }: { id: string; tableSeatCount: number }) {
  if (tableSeatCount < 0) throw new Error("tableSeatCount must be greater than or equal to 0");
  return await prisma.restaurant.update({ where: { id }, data: { tableSeatCount } });
}

export async function updateRestaurantCounterSeatCount({
  id,
  counterSeatCount
}: {
  id: string;
  counterSeatCount: number;
}) {
  if (counterSeatCount < 0) throw new Error("counterSeatCount must be greater than or equal to 0");
  return await prisma.restaurant.update({ where: { id }, data: { counterSeatCount } });
}

export async function updateRemark({ id, remark }: { id: string; remark: string }) {
  return await prisma.restaurant.update({ where: { id }, data: { remark } });
}
