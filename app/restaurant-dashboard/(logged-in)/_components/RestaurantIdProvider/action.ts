"use server";

import prisma from "@/lib/prisma/client";

export async function getStaffs({ lineId }: { lineId: string }) {
  return await prisma.staff.findMany({
    where: {
      lineId
    }
  });
}
