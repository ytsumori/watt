"use server";

import prisma from "@/lib/prisma";
import { DayOfWeek } from "@prisma/client";

export async function getOpenHours({ restaurantId }: { restaurantId: string }) {
  return prisma.restaurantOpenDay.findMany({
    include: {
      openHour: true,
    },
    where: {
      restaurantId,
    },
  });
}

export async function createOpenHour({
  restaurantId,
  day,
  startTime,
  endTime,
}: {
  restaurantId: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}) {
  const start = new Date("1000-01-01");
  start.setHours(
    parseInt(startTime.split(":")[0]),
    parseInt(startTime.split(":")[1])
  );
  const end = new Date("1000-01-01");
  end.setHours(
    parseInt(endTime.split(":")[0]),
    parseInt(endTime.split(":")[1])
  );
  await prisma.restaurantOpenDay.create({
    data: {
      restaurantId,
      day,
      openHour: {
        create: [
          {
            start,
            end,
          },
        ],
      },
    },
  });
}
