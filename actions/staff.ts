"use server";

import prisma from "@/lib/prisma";

export async function getStaffs({ lineId }: { lineId: string }) {
  return await prisma.staff.findMany({
    where: {
      lineId,
    },
  });
}
