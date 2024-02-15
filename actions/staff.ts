"use server";

import { verifyIdToken } from "@/lib/line-login";
import prisma from "@/lib/prisma/client";

export async function getStaffs({ lineId }: { lineId: string }) {
  return await prisma.staff.findMany({
    where: {
      lineId,
    },
  });
}

export async function createStaff({
  lineIdToken,
  restaurantId,
  password,
}: {
  lineIdToken: string;
  restaurantId: string;
  password: string;
}) {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
      password,
    },
  });
  if (!restaurant) {
    throw new Error("Invalid password");
  }
  const response = await verifyIdToken({ idToken: lineIdToken });
  return await prisma.staff.create({
    data: {
      lineId: response.sub,
      restaurantId,
    },
  });
}
