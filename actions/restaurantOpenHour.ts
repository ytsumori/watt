"use server";

import prisma from "@/lib/prisma";
import { DayOfWeek } from "@prisma/client";

export async function getOpenHours({ restaurantId }: { restaurantId: string }) {
  return prisma.restaurantOpenHour.findMany({
    where: {
      restaurantId,
    },
  });
}

export async function createOpenHour({
  restaurantId,
  day,
  startHour,
  startMinute,
  endHour,
  endMinute,
}: {
  restaurantId: string;
  day: DayOfWeek;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}) {
  return await prisma.restaurantOpenHour.create({
    data: {
      restaurantId,
      day,
      startHour,
      startMinute,
      endHour,
      endMinute,
    },
  });
}

export async function updateOpenHour({
  id,
  day,
  startHour,
  startMinute,
  endHour,
  endMinute,
}: {
  id: string;
  day: DayOfWeek;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}) {
  return await prisma.restaurantOpenHour.update({
    where: { id },
    data: {
      day,
      startHour,
      startMinute,
      endHour,
      endMinute,
    },
  });
}

export async function deleteOpenHour({ id }: { id: string }) {
  return await prisma.restaurantOpenHour.delete({
    where: { id },
  });
}
