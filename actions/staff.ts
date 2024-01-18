"use server";

import { verifyIdToken } from "@/lib/line-login";
import prisma from "@/lib/prisma";

export async function getStaffs({ lineId }: { lineId: string }) {
  return await prisma.staff.findMany({
    where: {
      lineId,
    },
  });
}

export async function createStaff({
  idToken,
  restaurantId,
}: {
  idToken: string;
  restaurantId: string;
}) {
  const response = await verifyIdToken({ idToken });
  return await prisma.staff.create({
    data: {
      lineId: response.sub,
      restaurantId,
    },
  });
}
