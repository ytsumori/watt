"use server";

import prisma from "@/lib/prisma";

export async function getStaffsByLineId({ lineId }: { lineId: string }) {
  return await prisma.staff.findMany({
    where: {
      lineId,
    },
  });
}
